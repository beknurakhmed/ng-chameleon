# 🦎 ng-chameleon

> **One Angular library. Four design systems. React-level DX.**

[![npm version](https://img.shields.io/npm/v/ng-chameleon.svg)](https://www.npmjs.com/package/ng-chameleon)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red.svg)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <a href="README.md"><strong>English</strong></a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.uz.md">O'zbek</a>
</p>

---

## What is ng-chameleon?

ng-chameleon is an Angular UI component library that lets you switch between four complete design systems — **Material**, **Chakra UI**, **Ant Design**, and **Shadcn/ui** — at runtime, without changing a single line of component code.

```html
<!-- The same component, four looks -->
<ch-button variant="solid" colorScheme="primary">Click me</ch-button>
```

Switch theme at runtime:

```typescript
import { ChameleonThemeService } from 'ng-chameleon';

constructor(private theme: ChameleonThemeService) {
  this.theme.setTheme('material');  // or 'chakra', 'antd', 'shadcn'
  this.theme.setColorMode('dark');  // or 'light', 'system'
}
```

---

## Features

- **4 design systems** — Material UI, Chakra UI, Ant Design, Shadcn/ui
- **30+ components** — buttons, forms, overlays, navigation, data display
- **Style props** — `<div chBox bg="primary.500" p="4" rounded="lg">` (like Chakra UI)
- **Runtime theme switching** — zero JS overhead, pure CSS custom properties
- **Dark mode** — built-in, zero config
- **Angular Signals** — full reactivity with `signal()`, `computed()`, `effect()`
- **ControlValueAccessor** — all form components work with `ngModel` and `formControlName`
- **Accessible** — ARIA roles, keyboard navigation, focus management
- **Tree-shakeable** — import only what you use
- **Angular CLI schematics** — `ng add ng-chameleon`, `ng g ng-chameleon:add button`

---

## Installation

```bash
ng add ng-chameleon
```

Interactive setup will ask:
- Which theme to use as default
- Whether to enable style props (`chBox`, `chFlex`, etc.)

Or manually:

```bash
npm install ng-chameleon
```

Then in your `AppModule`:

```typescript
import { ChameleonModule } from 'ng-chameleon';

@NgModule({
  imports: [ChameleonModule],
})
export class AppModule {}
```

---

## Quick Start

### 1. Set up the theme provider

In your `app.component.html`:

```html
<ch-toast-container position="top-right"></ch-toast-container>
<router-outlet></router-outlet>
```

In `index.html` (anti-FOUC):

```html
<script>
  (function() {
    var t = localStorage.getItem('ch-theme') || 'shadcn';
    var m = localStorage.getItem('ch-color-mode') || 'light';
    document.body.classList.add('ch-theme-' + t);
    if (m === 'dark') document.body.classList.add('ch-dark');
    document.documentElement.style.visibility = 'visible';
  })();
</script>
```

### 2. Use components

```html
<ch-card>
  <ch-card-header>
    <span chText fontSize="xl" fontWeight="bold">Welcome</span>
  </ch-card-header>
  <ch-card-body>
    <ch-input placeholder="Your name" size="md" />
    <ch-button variant="solid" colorScheme="primary" (clicked)="submit()">
      Get started
    </ch-button>
  </ch-card-body>
</ch-card>
```

---

## Component List

### Core components
| Component | Selector | Description |
|-----------|----------|-------------|
| Button | `<ch-button>` | Variants: solid, outline, ghost, link |
| Input | `<ch-input>` | Sizes, error state, addons |
| Card | `<ch-card>` | Header, body, footer slots |
| Badge | `<ch-badge>` | Color variants, sizes |
| Alert | `<ch-alert>` | Status variants, dismissable |
| Spinner | `<ch-spinner>` | Sizes, colors |
| Avatar | `<ch-avatar>` | Image, initials, group |
| Divider | `<ch-divider>` | Horizontal, vertical, labeled |
| Tag | `<ch-tag>` | Closable, variants |
| Skeleton | `<ch-skeleton>` | Shapes, animation |

### Forms & Overlays
| Component | Selector | Description |
|-----------|----------|-------------|
| Checkbox | `<ch-checkbox>` | Indeterminate, group, ControlValueAccessor |
| Radio | `<ch-radio>` | Group management, keyboard nav |
| Switch | `<ch-switch>` | Toggle with animation |
| Select | `<ch-select>` | Native select with custom styling |
| Combobox | `<ch-combobox>` | Searchable, multi-select, async |
| Textarea | `<ch-textarea>` | Auto-resize, char count |
| Date Picker | `<ch-date-picker>` | Single, range, keyboard nav |
| Slider | `<ch-slider>` | Range, step, keyboard, marks |
| Tooltip | `[chTooltip]` | Directive, placement, delay |
| Modal | `<ch-modal>` | Focus trap, sizes, animations |
| Drawer | `<ch-drawer>` | Four placements, scroll lock |
| Popover | `<ch-popover>` | Click-outside, placement |
| Dropdown | `<ch-dropdown-menu>` | Keyboard nav, icons, dividers |
| Menu | `<ch-menu>` | Click/hover/context trigger, nested |

### Data & Navigation
| Component | Selector | Description |
|-----------|----------|-------------|
| Table | `<ch-table>` | Sort, striped, bordered, hover |
| Tabs | `<ch-tabs>` | Keyboard nav, lazy loading |
| Accordion | `<ch-accordion>` | Single/multi expand |
| Breadcrumb | `<ch-breadcrumb>` | Separator variants |
| Pagination | `<ch-pagination>` | Boundary logic, sizes |
| Progress | `<ch-progress>` | Linear, striped, animated |
| Toast | `<ch-toast-container>` | Queue, positions, status variants |
| Chart | `<ch-chart>` | Line, bar, area, pie, donut — pure SVG |

---

## Style Props

ng-chameleon includes Chakra UI-inspired style prop directives:

```html
<!-- Generic container -->
<div chBox bg="primary.500" p="4" rounded="lg" shadow="md">

<!-- Flexbox -->
<div chFlex direction="row" gap="4" align="center" justify="space-between">

<!-- CSS Grid -->
<div chGrid cols="3" gap="4">

<!-- Typography -->
<span chText fontSize="xl" fontWeight="bold" color="gray.700">Hello</span>

<!-- Vertical/horizontal stack -->
<div chStack spacing="4" direction="column">
```

---

## Theming

### CSS Custom Properties

All components use CSS custom properties. The active theme class on `<body>` controls which values are in scope:

```css
/* body.ch-theme-shadcn */
--ch-primary:       hsl(222.2 47.4% 11.2%);
--ch-radius-md:     0.5rem;
--ch-font-body:     Inter, sans-serif;

/* body.ch-theme-chakra */
--ch-primary:       #3182CE;
--ch-radius-md:     0.375rem;
--ch-font-body:     Inter, sans-serif;

/* body.ch-theme-material */
--ch-primary:       #1976D2;
--ch-radius-md:     4px;
--ch-font-body:     Roboto, sans-serif;

/* body.ch-theme-antd */
--ch-primary:       #1677FF;
--ch-radius-md:     8px;
--ch-font-body:     -apple-system, sans-serif;
```

### Token Overrides

```typescript
this.theme.setOverrides({
  '--ch-primary': '#FF6B35',
  '--ch-radius-md': '12px',
});
```

### Dark Mode

```typescript
this.theme.setColorMode('dark');    // dark
this.theme.setColorMode('light');   // light
this.theme.setColorMode('system');  // follows OS preference
```

---

## CLI Schematics

### Install

```bash
ng add ng-chameleon
# Prompts: theme, style props, dark mode
```

### Add a component (copy-paste approach)

```bash
ng g ng-chameleon:add button
ng g ng-chameleon:add card modal input
# Copies component source into YOUR project — you own the code
```

### Switch theme

```bash
ng g ng-chameleon:set-theme material
# Updates all CSS token imports to use material theme
```

---

## Architecture

ng-chameleon uses a three-layer architecture:

```
Layer 3: THEMES     — CSS custom properties per design system
Layer 2: HELM       — Styled Angular components (use Layer 3 tokens)
Layer 1: BRAIN      — Headless logic, ARIA, keyboard navigation
```

- **Brain** — Pure logic directives. No styles. Handles focus trapping, ARIA, keyboard nav.
- **Helm** — Styled components. Reference CSS variables from the active theme.
- **Themes** — CSS files that define token values per design system. Loaded all at once; only the active `body` class matters.

---

## Project Structure

```
ng-chameleon/
├── packages/
│   ├── core/              # Main library (components + style props + themes)
│   └── schematics/        # ng add / add-component / set-theme
├── apps/
│   └── playground/        # Interactive demo app
├── angular.json
└── package.json
```

---

## Development

```bash
# Install dependencies
npm install

# Start playground
npm run playground          # http://localhost:4200

# Build library
npm run build:lib

# Build schematics
npm run build:schematics

# Run tests
npm test
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |

CSS `color-mix()` is used for hover/focus states — supported in all modern browsers as of 2024.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-component`
3. Follow the existing component structure (brain + helm pattern)
4. Write tests in `*.spec.ts`
5. Submit a PR

---

## Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/beknurakhmed">
        <img src="https://avatars.githubusercontent.com/u/129836413?v=4" width="80" alt="Beknur Akhmedov" style="border-radius:50%"><br>
        <strong>Beknur Akhmedov</strong>
      </a><br>
      <sub>Software Engineer · Full-Stack · ML</sub><br>
      <sub>📍 Uzbekistan</sub><br>
      <a href="https://github.com/beknurakhmed">GitHub</a> ·
      <a href="https://linkedin.com/in/beknur-akhmedov-6716292b4">LinkedIn</a>
    </td>
  </tr>
</table>

---

## License

MIT © [Beknur Akhmedov](https://github.com/beknurakhmed)
