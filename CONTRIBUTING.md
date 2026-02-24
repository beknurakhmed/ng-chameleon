# Contributing to ng-chameleon

Thank you for your interest in contributing to ng-chameleon! This guide will help you get started.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check the [existing issues](https://github.com/beknurakhmed/ng-chameleon/issues) to avoid duplicates
2. Use the bug report template when creating a new issue
3. Include:
   - Angular version
   - ng-chameleon version
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS

### Suggesting Features

1. Open an issue with the **feature request** label
2. Describe the use case and expected behavior
3. If possible, include mockups or code examples

### Pull Requests

1. Fork the repository
2. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feat/my-feature
   ```
3. Make your changes
4. Write or update tests
5. Ensure all tests pass:
   ```bash
   npm test
   ```
6. Build the library to verify:
   ```bash
   npm run build:lib
   ```
7. Commit your changes (see commit conventions below)
8. Push and open a Pull Request against `develop`

## Development Setup

```bash
# Clone the repo
git clone https://github.com/beknurakhmed/ng-chameleon.git
cd ng-chameleon

# Install dependencies
npm install

# Start the playground for live development
npm run playground

# Build the library in watch mode
npm run build:lib:watch
```

## Project Structure

```
packages/
├── core/
│   └── src/lib/
│       ├── components/        # UI components
│       │   └── <component>/
│       │       ├── brain/     # Headless logic (ARIA, keyboard, state)
│       │       └── helm/      # Styled component (uses theme tokens)
│       ├── style-props/       # chBox, chFlex, chGrid, chText, chStack
│       ├── theme-engine/      # ChameleonThemeService, provider
│       ├── themes/            # CSS files: shadcn, chakra, material, antd
│       ├── tokens/            # Design token interfaces
│       └── utils/             # class-merge, token-resolver
└── schematics/
    └── src/
        ├── ng-add/            # ng add ng-chameleon
        ├── add-component/     # ng g ng-chameleon:add <name>
        └── set-theme/         # ng g ng-chameleon:set-theme <theme>
```

## Component Guidelines

### Architecture: Brain + Helm

Every component should follow the brain/helm pattern:

- **Brain** (directive) — headless logic, ARIA attributes, keyboard handlers, state management. No styles.
- **Helm** (component) — uses the brain directive and applies themed styles via CSS custom properties.

### Creating a New Component

1. Create the directory: `packages/core/src/lib/components/<name>/`
2. Add brain directive: `brain/<name>-brain.directive.ts`
3. Add helm component: `helm/<name>.component.ts`
4. Add variants: `<name>.variants.ts` (using `cva()`)
5. Export from `public-api.ts`
6. Add to the playground showcase

### Styling Rules

- Use CSS custom properties (`var(--ch-*)`) for all theme-dependent values
- Use `class-variance-authority` (cva) for variant management
- Use `tailwind-merge` + `clsx` via the `classMerge` utility
- Never hardcode colors, border-radius, or font-family
- All components must support dark mode via `[data-ch-color-mode="dark"]`

### Testing

- Write unit tests in `*.spec.ts` files next to the component
- Test ARIA attributes, keyboard navigation, and visual states
- Test across all four themes when behavior varies

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add loading state with spinner
fix(modal): prevent scroll when open
docs: update installation guide
refactor(theme-engine): simplify signal logic
test(input): add keyboard navigation tests
chore: update Angular to 17.3
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Build, deps, tooling |

## Branch Strategy

- `main` — stable releases, tagged versions
- `develop` — integration branch for features
- `feat/*` — feature branches (from `develop`)
- `fix/*` — bugfix branches (from `develop`)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
