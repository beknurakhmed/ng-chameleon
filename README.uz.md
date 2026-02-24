# 🦎 ng-chameleon

> **Bitta Angular kutubxonasi. To'rtta dizayn tizimi. React darajasidagi DX.**

[![npm version](https://img.shields.io/npm/v/ng-chameleon.svg)](https://www.npmjs.com/package/ng-chameleon)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red.svg)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.uz.md"><strong>O'zbek</strong></a>
</p>

---

## ng-chameleon nima?

ng-chameleon — bu Angular UI komponent kutubxonasi bo'lib, to'rtta mashhur dizayn tizimi — **Material**, **Chakra UI**, **Ant Design** va **Shadcn/ui** — o'rtasida runtime'da qayta build qilmasdan almashish imkonini beradi.

```html
<!-- Bitta komponent — to'rtta ko'rinish -->
<ch-button variant="solid" colorScheme="primary">Bosing</ch-button>
```

Runtime'da mavzuni almashtirish:

```typescript
import { ChameleonThemeService } from 'ng-chameleon';

constructor(private theme: ChameleonThemeService) {
  this.theme.setTheme('material');  // yoki 'chakra', 'antd', 'shadcn'
  this.theme.setColorMode('dark');  // yoki 'light', 'system'
}
```

---

## Imkoniyatlar

- **4 ta dizayn tizimi** — Material UI, Chakra UI, Ant Design, Shadcn/ui
- **30+ komponent** — tugmalar, formalar, overlay'lar, navigatsiya, ma'lumotlarni ko'rsatish
- **Style props** — `<div chBox bg="primary.500" p="4" rounded="lg">` (Chakra UI kabi)
- **Runtime'da mavzu almashtirish** — sof CSS custom properties, JS yukisiz
- **Qorong'i rejim** — tayyor, sozlashsiz ishlaydi
- **Angular Signals** — to'liq reaktivlik: `signal()`, `computed()`, `effect()`
- **ControlValueAccessor** — barcha forma komponentlari `ngModel` va `formControlName` bilan ishlaydi
- **Qulaylik** — ARIA rollari, klaviatura navigatsiyasi, fokus boshqaruvi
- **Tree-shakeable** — faqat kerakli komponentlarni import qiling
- **CLI schematics** — `ng add ng-chameleon`, `ng g ng-chameleon:add button`

---

## O'rnatish

```bash
ng add ng-chameleon
```

Interaktiv sozlash so'raydi:
- Qaysi mavzuni standart sifatida ishlatish
- Style props (`chBox`, `chFlex` va h.k.) ni yoqish yoki yo'q

Yoki qo'lda:

```bash
npm install ng-chameleon
```

Keyin `AppModule`'da:

```typescript
import { ChameleonModule } from 'ng-chameleon';

@NgModule({
  imports: [ChameleonModule],
})
export class AppModule {}
```

---

## Tezkor boshlash

### 1. Mavzu provayderini sozlash

`app.component.html`'da:

```html
<ch-toast-container position="top-right"></ch-toast-container>
<router-outlet></router-outlet>
```

`index.html`'da (FOUC oldini olish):

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

### 2. Komponentlarni ishlating

```html
<ch-card>
  <ch-card-header>
    <span chText fontSize="xl" fontWeight="bold">Xush kelibsiz</span>
  </ch-card-header>
  <ch-card-body>
    <ch-input placeholder="Ismingiz" size="md" />
    <ch-button variant="solid" colorScheme="primary" (clicked)="submit()">
      Boshlash
    </ch-button>
  </ch-card-body>
</ch-card>
```

---

## Komponentlar ro'yxati

### Asosiy komponentlar
| Komponent | Selektor | Tavsif |
|-----------|----------|--------|
| Button | `<ch-button>` | Variantlar: solid, outline, ghost, link |
| Input | `<ch-input>` | O'lchamlar, xato holati, addonlar |
| Card | `<ch-card>` | Slotlar: header, body, footer |
| Badge | `<ch-badge>` | Rang variantlari, o'lchamlar |
| Alert | `<ch-alert>` | Status variantlari, yopiladigan |
| Spinner | `<ch-spinner>` | O'lchamlar, ranglar |
| Avatar | `<ch-avatar>` | Rasm, initsiallar, guruh |
| Divider | `<ch-divider>` | Gorizontal, vertikal, belgili |
| Tag | `<ch-tag>` | Yopiladigan, variantlar |
| Skeleton | `<ch-skeleton>` | Shakllar, animatsiya |

### Formalar va overlay'lar
| Komponent | Selektor | Tavsif |
|-----------|----------|--------|
| Checkbox | `<ch-checkbox>` | Noaniq holat, guruh, CVA |
| Radio | `<ch-radio>` | Guruh boshqaruvi, klaviatura navigatsiyasi |
| Switch | `<ch-switch>` | Animatsiyali o'tkazgich |
| Select | `<ch-select>` | Custom ko'rinishli nativ select |
| Textarea | `<ch-textarea>` | Avto o'lcham, belgilar hisoblagichi |
| Tooltip | `[chTooltip]` | Direktiva, joylashuv, kechikish |
| Modal | `<ch-modal>` | Focus trap, o'lchamlar, animatsiyalar |
| Drawer | `<ch-drawer>` | To'rt joylashuv, scroll blokirovkasi |
| Popover | `<ch-popover>` | Tashqariga bosishda yopish |
| Dropdown | `<ch-dropdown-menu>` | Klaviatura navigatsiyasi, ikonkalar |
| Tabs | `<ch-tabs>` | Klaviatura navigatsiyasi, lazy yuklash |
| Accordion | `<ch-accordion>` | Yakka/ko'p ochish |
| Progress | `<ch-progress>` | Chiziqli, chiziqli, animatsiyali |
| Toast | `<ch-toast-container>` | Navbat, pozitsiyalar, status variantlari |
| Breadcrumb | `<ch-breadcrumb>` | Ajratgich variantlari |

---

## Style Props

ng-chameleon Chakra UI'dan ilhomlangan style prop direktivalarini o'z ichiga oladi:

```html
<!-- Universal konteyner -->
<div chBox bg="primary.500" p="4" rounded="lg" shadow="md">

<!-- Flexbox -->
<div chFlex direction="row" gap="4" align="center" justify="space-between">

<!-- CSS Grid -->
<div chGrid cols="3" gap="4">

<!-- Tipografiya -->
<span chText fontSize="xl" fontWeight="bold" color="gray.700">Salom</span>

<!-- Vertikal/gorizontal stack -->
<div chStack spacing="4" direction="column">
```

---

## Mavzulashtirish

### CSS Custom Properties

Barcha komponentlar CSS custom properties ishlatadi. `<body>`'dagi faol mavzu klassi qiymatlarni belgilaydi:

```css
/* body.ch-theme-shadcn */
--ch-primary:       hsl(222.2 47.4% 11.2%);
--ch-radius-md:     0.5rem;
--ch-font-body:     Inter, sans-serif;

/* body.ch-theme-material */
--ch-primary:       #1976D2;
--ch-radius-md:     4px;
--ch-font-body:     Roboto, sans-serif;
```

### Tokenlarni qayta belgilash

```typescript
this.theme.setOverrides({
  '--ch-primary': '#FF6B35',
  '--ch-radius-md': '12px',
});
```

### Qorong'i rejim

```typescript
this.theme.setColorMode('dark');    // qorong'i
this.theme.setColorMode('light');   // yorug'
this.theme.setColorMode('system');  // OT sozlamasiga amal qiladi
```

---

## CLI Schematics

```bash
# O'rnatish
ng add ng-chameleon

# Mavzuni o'zgartirish
ng g ng-chameleon:set-theme material

# Komponent qo'shish
ng g ng-chameleon:add button
ng g ng-chameleon:add card modal input
```

---

## Arxitektura

ng-chameleon uch qatlamli arxitekturadan foydalanadi:

```
Qatlam 3: THEMES     — Har bir dizayn tizimi uchun CSS custom properties
Qatlam 2: HELM       — Stilizatsiya qilingan Angular komponentlar (3-qatlam tokenlarini ishlatadi)
Qatlam 1: BRAIN      — Headless mantiq, ARIA, klaviatura navigatsiyasi
```

---

## Loyiha tuzilishi

```
ng-chameleon/
├── packages/
│   ├── core/              # Asosiy kutubxona (komponentlar + style props + mavzular)
│   └── schematics/        # ng add / add-component / set-theme
├── apps/
│   └── playground/        # Interaktiv demo ilova
├── angular.json
└── package.json
```

---

## Ishlab chiqish

```bash
# Bog'liqliklarni o'rnatish
npm install

# Playground'ni ishga tushirish
npm run playground          # http://localhost:4200

# Kutubxonani build qilish
npm run build:lib

# Schematics'ni build qilish
npm run build:schematics

# Testlarni ishga tushirish
npm test
```

---

## Loyihaga hissa qo'shish

Batafsil [CONTRIBUTING.md](CONTRIBUTING.md)'da.

---

## Muallif

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/beknurakhmed">
        <img src="https://avatars.githubusercontent.com/u/129836413?v=4" width="80" alt="Beknur Akhmedov" style="border-radius:50%"><br>
        <strong>Beknur Akhmedov</strong>
      </a><br>
      <sub>Software Engineer · Full-Stack · ML</sub><br>
      <sub>O'zbekiston</sub><br>
      <a href="https://github.com/beknurakhmed">GitHub</a> ·
      <a href="https://linkedin.com/in/beknur-akhmedov-6716292b4">LinkedIn</a>
    </td>
  </tr>
</table>

---

## Litsenziya

MIT © [Beknur Akhmedov](https://github.com/beknurakhmed)
