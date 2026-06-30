# Cloudflare Pages Deployment Guide

This document explains how to deploy and manage the site on Cloudflare Pages.

## Initial Setup

### Method 1: Cloudflare Dashboard (Recommended for First Time)

1. **Sign up for Cloudflare**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Create a free account

2. **Connect Your GitHub Repository**
   - In Cloudflare Dashboard, go to **Pages**
   - Click **"Create a project"**
   - Click **"Connect to Git"**
   - Authorize Cloudflare to access your GitHub account
   - Select `adamsimms/adamsimms.xyz`

3. **Configure Build Settings**
   ```
   Project name: adamsimms-xyz
   Production branch: main
   Build command: npm run build
   Build output directory: .
   Root directory: /
   ```

4. **Environment Variables** (if needed)
   - Click **"Add variable"**
   - Add any required environment variables
   - For this project: none needed initially

5. **Deploy**
   - Click **"Save and Deploy"**
   - First build takes 2-3 minutes
   - You'll get a URL: `https://adamsimms-xyz.pages.dev`

### Method 2: Wrangler CLI (For Developers)

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   # or use the local version
   npx wrangler --version
   ```

2. **Login to Cloudflare**
   ```bash
   npm run cf:login
   # or
   npx wrangler login
   ```
   This opens a browser to authenticate.

3. **Get Your Account ID**
   ```bash
   npx wrangler whoami
   ```
   Copy your Account ID.

4. **Deploy**
   ```bash
   npm run deploy
   # or manually
   npm run build
   npx wrangler pages deploy . --project-name=adamsimms-xyz
   ```

## Custom Domain Setup

### Connect adamsimms.xyz to Cloudflare Pages

1. **Add Domain to Cloudflare Pages**
   - In Pages project settings, click **"Custom domains"**
   - Click **"Set up a custom domain"**
   - Enter `adamsimms.xyz`
   - Also add `www.adamsimms.xyz`

2. **Update DNS Records**

   If domain is already on Cloudflare (recommended):
   - DNS records are automatically created
   - CNAME for `adamsimms.xyz` → `adamsimms-xyz.pages.dev`
   - CNAME for `www.adamsimms.xyz` → `adamsimms-xyz.pages.dev`

   If domain is elsewhere:
   - Transfer nameservers to Cloudflare (recommended)
   - Or manually create CNAME records pointing to `adamsimms-xyz.pages.dev`

3. **SSL/TLS**
   - Cloudflare automatically provisions SSL certificate
   - Enable "Always Use HTTPS" in SSL/TLS settings
   - Set SSL/TLS encryption mode to "Full" or "Full (strict)"

## GitHub Actions Deployment

The project includes a GitHub Actions workflow for automatic deployments.

### Setup GitHub Secrets

1. **Get Cloudflare API Token**
   - Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click **"Create Token"**
   - Use template **"Edit Cloudflare Workers"** or create custom with:
     - Permissions: `Account - Cloudflare Pages - Edit`
   - Copy the token

2. **Get Cloudflare Account ID**
   - In Cloudflare Dashboard, go to any page
   - Copy Account ID from the URL or sidebar

3. **Add Secrets to GitHub**
   - Go to repository **Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Add:
     - `CLOUDFLARE_API_TOKEN`: Your API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your account ID

4. **Workflow Runs Automatically**
   - Push to `main` → deploys to production
   - Open PR → deploys preview to unique URL
   - PR comments include preview link

## Deployment Commands

```bash
# Deploy to production
npm run deploy

# Deploy preview/staging
npm run deploy:preview

# Login to Cloudflare
npm run cf:login

# View deployment logs
npx wrangler pages deployment list --project-name=adamsimms-xyz

# View project info
npx wrangler pages project list
```

## Cloudflare Pages Features

### Automatic Preview Deployments
- Every PR gets a unique preview URL
- Format: `https://adamsimms-xyz-<branch>.pages.dev`
- Automatically updates with new commits
- Preview URLs in PR comments

### Environment Variables
- Set in Dashboard: Pages → Settings → Environment variables
- Separate variables for Production and Preview
- Available during build and runtime

### Build Configuration
- Node.js version: Automatically detected from package.json
- Build timeout: 20 minutes default
- Build cache: Enabled automatically
- Failed builds don't affect production

### Redirects and Headers

**_headers file** (already configured):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Content-Security-Policy: ...
```

**Create _redirects file** (optional):
```
# Redirect www to non-www
https://www.adamsimms.xyz/* https://adamsimms.xyz/:splat 301!

# Redirect old paths
/old-path /new-path 301
```

## Monitoring and Analytics

### Built-in Web Analytics (Free)
1. In Pages project, go to **Web Analytics**
2. Click **"Enable Web Analytics"**
3. Add the analytics script to your site:
   ```html
   <script defer src='https://static.cloudflare.com/beacon.min.js' 
           data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
   ```

### View Metrics
- Pageviews
- Unique visitors
- Top pages
- Referrers
- Performance metrics

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
npx wrangler pages deployment tail --project-name=adamsimms-xyz
```

**Common issues:**
- Node version mismatch: Set `NODE_VERSION=20` in environment variables
- Missing dependencies: Ensure `package-lock.json` is committed
- Build command error: Test locally with `npm run build`

### Preview URL 404s

- Preview deployments may take 1-2 minutes after push
- Check GitHub Actions workflow status
- Verify branch name in URL matches branch

### Custom Domain Not Working

1. Verify DNS records are correct (CNAME to `adamsimms-xyz.pages.dev`)
2. Wait for DNS propagation (up to 24 hours, usually < 1 hour)
3. Check SSL certificate status in Cloudflare Dashboard
4. Ensure "Always Use HTTPS" is enabled

### Headers Not Applied

- Verify `_headers` file is in root directory
- Check syntax: [Cloudflare Headers Docs](https://developers.cloudflare.com/pages/configuration/headers/)
- Deploy again after fixing
- Test with: `curl -I https://adamsimms.xyz`

## Performance Optimization

### Cloudflare CDN
- Content cached at 300+ edge locations globally
- Automatic HTTP/2 and HTTP/3
- Brotli compression enabled by default
- Smart routing for fastest origin

### Caching Strategy

**Cache-Control headers:**
```
# Add to _headers
/css/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000

/*.html
  Cache-Control: public, max-age=3600
```

## Comparison: Cloudflare Pages vs GitHub Pages

| Feature | Cloudflare Pages | GitHub Pages |
|---------|------------------|--------------|
| Build time | 1-3 min | 2-5 min |
| Deploy time | ~30 sec | 1-2 min |
| CDN | 300+ locations | Limited |
| Bandwidth | Unlimited | Soft limit |
| HTTPS | Universal SSL | Limited cert options |
| Headers | Full support (_headers) | Limited |
| Redirects | Full support (_redirects) | Limited |
| Preview deploys | ✅ Every PR | ❌ No |
| Web Analytics | ✅ Built-in free | ❌ Need external |
| Functions | ✅ Cloudflare Workers | ❌ No |
| Cost | Free | Free |

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Set up custom domain
3. ✅ Configure GitHub Actions
4. Enable Web Analytics
5. Set up redirects (if needed)
6. Configure cache headers
7. Monitor performance

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Web Analytics](https://www.cloudflare.com/web-analytics/)

## Support

- Cloudflare Community: [community.cloudflare.com](https://community.cloudflare.com)
- Discord: [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
- Docs: [developers.cloudflare.com](https://developers.cloudflare.com)
