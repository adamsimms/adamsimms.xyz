# Security Policy

## Reporting a vulnerability

**Do not open public GitHub issues for security vulnerabilities.**

Please report security issues privately using one of these channels:

1. **GitHub private vulnerability reporting** — Use the [Security tab](https://github.com/adamsimms/adamsimms.xyz/security/advisories/new) on this repository to submit a confidential report.
2. **Email** — Contact Adam Simms via [LinkedIn](https://www.linkedin.com/in/adamsimms).

Include as much detail as possible: description, steps to reproduce, impact, and any suggested fix.

## What to expect

- Acknowledgement within a reasonable timeframe
- Updates on the status of the report
- Credit in the advisory if you wish (optional)

## Scope

This policy covers the `adamsimms.xyz` website and this repository. Third-party services (Cloudflare, Google Fonts, external links) are out of scope but will be noted if relevant.

## Security measures

The site uses HTTP security headers configured in `_headers`:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

These are defense-in-depth measures. If you find a way to bypass them, please report it privately.
