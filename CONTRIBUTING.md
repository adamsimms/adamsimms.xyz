# Contributing to adamsimms.xyz

Thank you for your interest in contributing.

## How to contribute

### Reporting bugs

Create an issue with:

- A clear title
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS (if relevant)

### Security issues

Do **not** open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md).

### Pull requests

1. Fork the repository
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run validate`
5. Commit with a [conventional commit](https://www.conventionalcommits.org/) message
6. Open a pull request

## Coding standards

### HTML

- Use semantic HTML5 elements
- Include ARIA labels where appropriate
- Maintain WCAG 2.1 AA accessibility

### CSS

- Use CSS custom properties for theming
- Mobile-first responsive design
- Run `npm run lint:css` before committing

## Testing before a PR

1. Test in Chrome, Firefox, and Safari
2. Test on mobile or with responsive dev tools
3. Run `npm run validate`

## Commit messages

Use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Formatting
- `refactor:` — Code restructuring
- `chore:` — Maintenance

## Release process

Pushes to `main` deploy automatically to Cloudflare Pages via GitHub Actions.

## Questions

- GitHub Issues for project questions
- [LinkedIn](https://www.linkedin.com/in/adamsimms) for general inquiries

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
