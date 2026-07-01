# adamsimms.xyz

CV for Adam Simms — technologist, designer, artist, and educator.

## Overview

A static website showcasing professional work, education, and creative projects. Built with semantic HTML and CSS, deployed on Cloudflare Pages.

## Tech stack

- **HTML5** — Semantic markup with accessibility features
- **CSS3** — Custom properties, responsive design
- **Google Fonts** — Inter, Outfit, JetBrains Mono
- **Cloudflare Pages** — Hosting, CDN, and security headers

## Project structure

```
adamsimms.xyz/
├── css/
│   ├── normalize.css    # CSS reset
│   └── styles.css       # Site styles
├── img/                 # Favicon and social images
├── index.html           # Homepage
├── now/                 # Now page (hidden from search engines)
├── 404.html             # Custom error page
├── _headers             # Security headers
├── _redirects           # URL redirects
└── package.json         # Dev tooling
```

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/adamsimms/adamsimms.xyz.git
cd adamsimms.xyz
npm install
npm start
```

The site will be available at `http://localhost:3000`.

## Development

### Scripts

- `npm start` — Local development server
- `npm run lint` — Run HTML and CSS linters
- `npm run format` — Format code with Prettier
- `npm run validate` — Alias for `npm run lint`
- `npm run lighthouse` — Run a Lighthouse audit against production
- `npm run deploy` — Deploy to Cloudflare Pages via Wrangler

### Code quality

- **HTMLHint** for HTML validation
- **Stylelint** for CSS linting
- **Prettier** for formatting
- **Husky + lint-staged** for pre-commit checks

Run `npm run lint` before committing.

## Deployment

The site deploys automatically to Cloudflare Pages on pushes to `main`. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup details.

## Accessibility

- Semantic HTML5 elements
- ARIA labels for screen readers
- Skip navigation link
- Keyboard-friendly navigation
- Responsive typography

## Security

Security headers are configured in `_headers`. To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Contact

Adam Simms

- Website: [adamsimms.xyz](https://adamsimms.xyz)
- LinkedIn: [linkedin.com/in/adamsimms](https://www.linkedin.com/in/adamsimms)
- Instagram: [@adamsimms](https://instagram.com/adamsimms)
