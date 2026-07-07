# Deployment

The site is hosted on [Cloudflare Pages](https://pages.cloudflare.com/). There is no build step — static files are deployed as-is.

## Quick start

1. Push to `main` — GitHub Actions deploys automatically (see `.github/workflows/cloudflare-pages.yml`).
2. Or deploy manually:

```bash
npm run deploy
```

Production URL: `https://adamsimms.xyz`

## First-time Cloudflare setup

### Dashboard

1. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. **Create a project** → **Connect to Git**
3. Select `adamsimms/adamsimms.xyz`
4. Configure:

```
Project name: adamsimms-xyz
Production branch: main
Build command: (none)
Build output directory: /
```

5. **Save and Deploy**

### Custom domain

1. In the Pages project, go to **Custom domains**
2. Add `adamsimms.xyz` and `www.adamsimms.xyz`
3. DNS should point to `adamsimms-xyz.pages.dev`
4. Enable **Always Use HTTPS** in SSL/TLS settings

Redirects for www and HTTP are configured in `_redirects`.

## GitHub Actions secrets

For automatic deployments, add these repository secrets:

| Secret                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token with **Cloudflare Pages — Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID                            |

Get these from [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) and your account dashboard.

## Preview deployments

Pull requests get preview URLs at `https://adamsimms-xyz-<branch>.pages.dev`. The deploy workflow posts the link as a PR comment.

## Wrangler CLI

```bash
npm run cf:login          # Authenticate
npm run deploy            # Deploy production
npm run deploy:preview    # Deploy preview branch
```

## Headers and redirects

- `_headers` — Security headers (CSP, X-Frame-Options, etc.)
- `_redirects` — www → apex, HTTP → HTTPS

## Umami analytics

This site uses [Umami Cloud](https://umami.is/) (Hobby plan) for privacy-friendly analytics. Configuration lives in `analytics.config.json`.

1. Sign up at [cloud.umami.is](https://cloud.umami.is) and add a website named `adamsimms.xyz`.
2. Copy the website ID into `analytics.config.json` (`umamiWebsiteId`), or set the `UMAMI_WEBSITE_ID` repository variable for CI.
3. Run `npm run analytics:sync` to inject the tracker into `index.html`.
4. Deploy.

The tracker is limited to `adamsimms.xyz` and `syllabi.adamsimms.xyz` via `data-domains`. Archive pages are not tracked.

Syllabi use the same website ID — see [adamsimms/syllabi](https://github.com/adamsimms/syllabi).

## Troubleshooting

| Issue                     | Fix                                                                            |
| ------------------------- | ------------------------------------------------------------------------------ |
| Deploy fails              | Check GitHub Actions logs and Cloudflare API token permissions                 |
| Custom domain not working | Verify DNS CNAME to `adamsimms-xyz.pages.dev`; wait for propagation            |
| Headers not applied       | Confirm `_headers` syntax; redeploy; test with `curl -I https://adamsimms.xyz` |

## Resources

- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI docs](https://developers.cloudflare.com/workers/wrangler/)
