# Contributing to adamsimms.xyz

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## 🎯 How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:
- A clear, descriptive title
- Detailed description of the proposed enhancement
- Use cases and benefits
- Any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linters and tests (`npm run validate`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Coding Standards

### HTML

- Use semantic HTML5 elements
- Include ARIA labels where appropriate
- Maintain accessibility standards (WCAG 2.1 AA)
- Keep markup clean and well-indented

### CSS

- Use CSS custom properties (CSS variables) for theming
- Follow BEM naming convention where applicable
- Maintain mobile-first responsive design
- Run `npm run lint:css` before committing

### JavaScript

- Use modern ES6+ syntax
- Keep code modular and reusable
- Comment complex logic
- Run `npm run lint:js` before committing

## 🧪 Testing

Before submitting a PR:

1. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test on mobile devices or emulators
3. Run `npm run validate` to check for errors
4. Run `npm run lighthouse` to verify performance

## 📋 Commit Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add dark mode toggle
fix: resolve mobile navigation issue
docs: update README with new features
```

## 🔍 Code Review Process

1. PRs require at least one review
2. All CI checks must pass
3. Code must follow project standards
4. Changes should be well-documented

## 🚀 Release Process

1. Version bump in `package.json`
2. Update CHANGELOG.md
3. Create GitHub release
4. Automatic deployment via GitHub Actions

## 📞 Questions?

Feel free to reach out via:
- GitHub Issues for project-related questions
- [LinkedIn](https://www.linkedin.com/in/adamsimms) for general inquiries

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
