# Portfolio Archive (2009–2014)

Static snapshot of the archived Adam Simms portfolio.

**Live URL:** https://adamsimms.xyz/archive/2009/

## Password protection

The `/archive/` path is protected with HTTP Basic Auth on Cloudflare Pages.

Set these environment variables in **Cloudflare Pages → Settings → Environment variables** (Production and Preview):

| Variable                | Description              |
| ----------------------- | ------------------------ |
| `ARCHIVE_AUTH_USER`     | Username for the archive |
| `ARCHIVE_AUTH_PASSWORD` | Password for the archive |

For local testing with Wrangler:

```bash
cp .dev.vars.example .dev.vars   # from repo root
# edit .dev.vars with your credentials
npx wrangler pages dev .
```

Static hosting with `npx serve` does not run the auth middleware — protection applies only on Cloudflare.

## Local preview

```bash
cd archive/2009
php -S 127.0.0.1:9090
# http://127.0.0.1:9090/index.html
```

## Editing

Pages are plain HTML. Edit files directly in this folder and commit — no build step required.

The original PHP source lives in the separate `design-v1` project if you ever need to regenerate from templates.
