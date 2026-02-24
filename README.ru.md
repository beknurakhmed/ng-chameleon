# 🦎 ng-chameleon

> **Одна Angular-библиотека. Четыре дизайн-системы. DX уровня React.**

[![npm version](https://img.shields.io/npm/v/ng-chameleon.svg)](https://www.npmjs.com/package/ng-chameleon)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red.svg)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.ru.md"><strong>Русский</strong></a> ·
  <a href="README.uz.md">O'zbek</a>
</p>

---

## Что такое ng-chameleon?

ng-chameleon — это Angular UI-библиотека компонентов, которая позволяет переключаться между четырьмя популярными дизайн-системами — **Material**, **Chakra UI**, **Ant Design** и **Shadcn/ui** — прямо в рантайме, без пересборки.

```html
<!-- Один компонент — четыре оформления -->
<ch-button variant="solid" colorScheme="primary">Нажми</ch-button>
```

Переключение темы в рантайме:

```typescript
import { ChameleonThemeService } from 'ng-chameleon';

constructor(private theme: ChameleonThemeService) {
  this.theme.setTheme('material');  // или 'chakra', 'antd', 'shadcn'
  this.theme.setColorMode('dark');  // или 'light', 'system'
}
```

---

## Возможности

- **4 дизайн-системы** — Material UI, Chakra UI, Ant Design, Shadcn/ui
- **30+ компонентов** — кнопки, формы, оверлеи, навигация, отображение данных
- **Style props** — `<div chBox bg="primary.500" p="4" rounded="lg">` (как в Chakra UI)
- **Переключение тем в рантайме** — чистые CSS custom properties, без JS-оверхеда
- **Тёмная тема** — из коробки, без конфигурации
- **Angular Signals** — полная реактивность: `signal()`, `computed()`, `effect()`
- **ControlValueAccessor** — все формы работают с `ngModel` и `formControlName`
- **Доступность** — ARIA-роли, клавиатурная навигация, управление фокусом
- **Tree-shakeable** — импортируйте только то, что используете
- **CLI schematics** — `ng add ng-chameleon`, `ng g ng-chameleon:add button`

---

## Установка

```bash
ng add ng-chameleon
```

Интерактивная настройка спросит:
- Какую тему использовать по умолчанию
- Включить ли style props (`chBox`, `chFlex` и т.д.)

Или вручную:

```bash
npm install ng-chameleon
```

Затем в `AppModule`:

```typescript
import { ChameleonModule } from 'ng-chameleon';

@NgModule({
  imports: [ChameleonModule],
})
export class AppModule {}
```

---

## Быстрый старт

### 1. Настройка провайдера темы

В `app.component.html`:

```html
<ch-toast-container position="top-right"></ch-toast-container>
<router-outlet></router-outlet>
```

В `index.html` (анти-FOUC):

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

### 2. Используйте компоненты

```html
<ch-card>
  <ch-card-header>
    <span chText fontSize="xl" fontWeight="bold">Добро пожаловать</span>
  </ch-card-header>
  <ch-card-body>
    <ch-input placeholder="Ваше имя" size="md" />
    <ch-button variant="solid" colorScheme="primary" (clicked)="submit()">
      Начать
    </ch-button>
  </ch-card-body>
</ch-card>
```

---

## Список компонентов

### Основные компоненты
| Компонент | Селектор | Описание |
|-----------|----------|----------|
| Button | `<ch-button>` | Варианты: solid, outline, ghost, link |
| Input | `<ch-input>` | Размеры, состояние ошибки, аддоны |
| Card | `<ch-card>` | Слоты: header, body, footer |
| Badge | `<ch-badge>` | Цветовые варианты, размеры |
| Alert | `<ch-alert>` | Статусные варианты, закрываемый |
| Spinner | `<ch-spinner>` | Размеры, цвета |
| Avatar | `<ch-avatar>` | Изображение, инициалы, группа |
| Divider | `<ch-divider>` | Горизонтальный, вертикальный, с меткой |
| Tag | `<ch-tag>` | Закрываемый, варианты |
| Skeleton | `<ch-skeleton>` | Формы, анимация |

### Формы и оверлеи
| Компонент | Селектор | Описание |
|-----------|----------|----------|
| Checkbox | `<ch-checkbox>` | Неопределённое состояние, группа, CVA |
| Radio | `<ch-radio>` | Управление группой, клавиатурная навигация |
| Switch | `<ch-switch>` | Переключатель с анимацией |
| Select | `<ch-select>` | Нативный select с кастомным оформлением |
| Textarea | `<ch-textarea>` | Авторазмер, счётчик символов |
| Tooltip | `[chTooltip]` | Директива, позиционирование, задержка |
| Modal | `<ch-modal>` | Focus trap, размеры, анимации |
| Drawer | `<ch-drawer>` | Четыре позиции, блокировка скролла |
| Popover | `<ch-popover>` | Закрытие по клику вне, позиционирование |
| Dropdown | `<ch-dropdown-menu>` | Клавиатурная навигация, иконки |
| Tabs | `<ch-tabs>` | Клавиатурная навигация, ленивая загрузка |
| Accordion | `<ch-accordion>` | Одиночное/множественное раскрытие |
| Progress | `<ch-progress>` | Линейный, полосатый, анимированный |
| Toast | `<ch-toast-container>` | Очередь, позиции, статусные варианты |
| Breadcrumb | `<ch-breadcrumb>` | Варианты разделителей |

---

## Style Props

ng-chameleon включает директивы стилевых пропсов, вдохновлённые Chakra UI:

```html
<!-- Универсальный контейнер -->
<div chBox bg="primary.500" p="4" rounded="lg" shadow="md">

<!-- Flexbox -->
<div chFlex direction="row" gap="4" align="center" justify="space-between">

<!-- CSS Grid -->
<div chGrid cols="3" gap="4">

<!-- Типографика -->
<span chText fontSize="xl" fontWeight="bold" color="gray.700">Привет</span>

<!-- Вертикальный/горизонтальный стек -->
<div chStack spacing="4" direction="column">
```

---

## Темизация

### CSS Custom Properties

Все компоненты используют CSS custom properties. Активный класс темы на `<body>` определяет значения:

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

### Переопределение токенов

```typescript
this.theme.setOverrides({
  '--ch-primary': '#FF6B35',
  '--ch-radius-md': '12px',
});
```

### Тёмная тема

```typescript
this.theme.setColorMode('dark');    // тёмная
this.theme.setColorMode('light');   // светлая
this.theme.setColorMode('system');  // следует за ОС
```

---

## CLI Schematics

```bash
# Установка
ng add ng-chameleon

# Смена темы
ng g ng-chameleon:set-theme material

# Добавление компонента
ng g ng-chameleon:add button
ng g ng-chameleon:add card modal input
```

---

## Архитектура

ng-chameleon использует трёхслойную архитектуру:

```
Слой 3: THEMES     — CSS custom properties для каждой дизайн-системы
Слой 2: HELM       — Стилизованные Angular-компоненты (используют токены слоя 3)
Слой 1: BRAIN      — Headless-логика, ARIA, клавиатурная навигация
```

---

## Структура проекта

```
ng-chameleon/
├── packages/
│   ├── core/              # Основная библиотека (компоненты + style props + темы)
│   └── schematics/        # ng add / add-component / set-theme
├── apps/
│   └── playground/        # Интерактивное демо-приложение
├── angular.json
└── package.json
```

---

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск playground
npm run playground          # http://localhost:4200

# Сборка библиотеки
npm run build:lib

# Сборка schematics
npm run build:schematics

# Запуск тестов
npm test
```

---

## Вклад в проект

Подробнее в [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Автор

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/beknurakhmed">
        <img src="https://avatars.githubusercontent.com/u/129836413?v=4" width="80" alt="Beknur Akhmedov" style="border-radius:50%"><br>
        <strong>Beknur Akhmedov</strong>
      </a><br>
      <sub>Software Engineer · Full-Stack · ML</sub><br>
      <sub>Узбекистан</sub><br>
      <a href="https://github.com/beknurakhmed">GitHub</a> ·
      <a href="https://linkedin.com/in/beknur-akhmedov-6716292b4">LinkedIn</a>
    </td>
  </tr>
</table>

---

## Лицензия

MIT © [Beknur Akhmedov](https://github.com/beknurakhmed)
