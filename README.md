# adamsimms.xyz

Personal portfolio website for Adam Simms - technologist, designer, artist, and educator.

## 🚀 Overview

This is a static website showcasing Adam Simms' professional work, education, and creative projects. The site is built with modern web standards, emphasizing performance, accessibility, and SEO.

## 🛠️ Tech Stack

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties (CSS variables), responsive design
- **Vanilla JavaScript** - Service Worker for offline functionality
- **Google Analytics** - Privacy-respecting analytics
- **Progressive Web App** - Installable with offline support

## 📦 Project Structure

```
adamsimms.xyz/
├── css/
│   ├── normalize.css      # CSS reset
│   ├── webflow.css        # Base Webflow styles
│   └── styles.css         # Custom styles with CSS variables
├── fonts/                 # Self-hosted web fonts
├── img/                   # Images and icons
├── js/
│   └── webflow.js         # Webflow utilities
├── scripts/
│   └── optimize.js        # Build optimization script
├── index.html             # Main HTML file
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker for offline support
├── sitemap.xml           # XML sitemap for SEO
├── robots.txt            # Robots directives
├── _headers              # Security headers (for Netlify/Cloudflare)
└── package.json          # Dependencies and scripts
```

## 🏃 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adamsimms/adamsimms.xyz.git
cd adamsimms.xyz
```

2. Install dependencies:
```bash
npm install
```

3. Start local development server:
```bash
npm start
```

The site will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm start` - Start local development server
- `npm run build` - Build optimized production assets
- `npm run lint` - Run all linters (HTML, CSS, JS)
- `npm run format` - Format code with Prettier
- `npm run validate` - Validate HTML and run linters
- `npm run lighthouse` - Run Lighthouse performance audit

### Code Quality

This project uses:
- **ESLint** for JavaScript linting
- **Stylelint** for CSS linting
- **HTMLHint** for HTML validation
- **Prettier** for code formatting

Run `npm run lint` before committing to ensure code quality.

## 🚀 Deployment

The site is deployed via GitHub Pages and is automatically updated when changes are pushed to the `main` branch.

### Manual Deployment

```bash
npm run deploy
```

## ♿ Accessibility

This site is built with accessibility in mind:
- Semantic HTML5 elements
- ARIA labels for screen readers
- Skip navigation link
- Keyboard-friendly navigation
- High contrast ratios
- Responsive font sizing

## 🔒 Security

Security features implemented:
- Content Security Policy (CSP)
- X-Frame-Options header
- X-Content-Type-Options header
- Subresource Integrity (SRI) for external scripts
- HTTPS-only external resources

## 📈 Performance

Performance optimizations:
- Minimal JavaScript footprint
- CSS custom properties
- Font preloading
- Resource hints (preconnect, dns-prefetch)
- Service Worker caching
- Lazy loading where applicable

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📧 Contact

Adam Simms
- Website: [adamsimms.xyz](https://adamsimms.xyz)
- LinkedIn: [linkedin.com/in/adamsimms](https://www.linkedin.com/in/adamsimms)
- Instagram: [@adamsimms](https://instagram.com/adamsimms)

---

Built with ❤️ by Adam Simms
