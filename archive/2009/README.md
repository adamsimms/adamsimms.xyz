# Portfolio Archive (2009–2014)

Source and static export for the archived Adam Simms portfolio.

**Live URL:** https://adamsimms.xyz/archive/2009/dist/

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

Static hosting with `php -S` or `npx serve` does not run the auth middleware — protection applies only on Cloudflare.

## Structure

```
archive/2009/
├── *.php, css/, js/, images/   # Source (PHP includes)
├── build.php                    # Static export script
└── dist/                        # Built static site (committed)
```

## Rebuild static export

```bash
cd archive/2009
SITE_BASE_PATH=/archive/2009/dist php build.php
```

## Local preview

**PHP source:**

```bash
php -S 127.0.0.1:9090
# http://127.0.0.1:9090/index.php
```

**Static build:**

```bash
SITE_BASE_PATH=/archive/2009/dist php build.php
cd dist && php -S 127.0.0.1:9090
# http://127.0.0.1:9090/index.html
```
