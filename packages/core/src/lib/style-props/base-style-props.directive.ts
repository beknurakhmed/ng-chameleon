import {
  Directive,
  Input,
  OnChanges,
  ElementRef,
  Renderer2,
  inject,
} from '@angular/core';
import { resolveStyleProp, resolveColor, resolveSpacing, resolveRadius, resolveShadow } from '../utils/token-resolver.util';

/**
 * Base class for all style-prop directives.
 * Handles shared props: spacing, color, sizing, border, shadow.
 */
@Directive()
export abstract class BaseStylePropsDirective implements OnChanges {
  protected readonly el   = inject(ElementRef<HTMLElement>);
  protected readonly renderer = inject(Renderer2);

  // ── Colors ──────────────────────────────────────────────────────────
  @Input() bg?: string;
  @Input() bgColor?: string;
  @Input() color?: string;
  @Input() borderColor?: string;

  // ── Spacing ─────────────────────────────────────────────────────────
  @Input() p?: string | number;
  @Input() px?: string | number;
  @Input() py?: string | number;
  @Input() pt?: string | number;
  @Input() pr?: string | number;
  @Input() pb?: string | number;
  @Input() pl?: string | number;
  @Input() m?: string | number;
  @Input() mx?: string | number;
  @Input() my?: string | number;
  @Input() mt?: string | number;
  @Input() mr?: string | number;
  @Input() mb?: string | number;
  @Input() ml?: string | number;

  // ── Sizing ───────────────────────────────────────────────────────────
  @Input() w?: string | number;
  @Input() h?: string | number;
  @Input() minW?: string | number;
  @Input() maxW?: string | number;
  @Input() minH?: string | number;
  @Input() maxH?: string | number;

  // ── Border ───────────────────────────────────────────────────────────
  @Input() rounded?: string;
  @Input() border?: string | number;
  @Input() shadow?: string;

  // ── Misc ─────────────────────────────────────────────────────────────
  @Input() opacity?: string | number;
  @Input() zIndex?: string | number;
  @Input() cursor?: string;
  @Input() overflow?: string;
  @Input() overflowX?: string;
  @Input() overflowY?: string;
  @Input() position?: string;

  // ── Responsive ───────────────────────────────────────────────────────
  @Input('bg.sm')  bgSm?: string;
  @Input('bg.md')  bgMd?: string;
  @Input('bg.lg')  bgLg?: string;
  @Input('p.sm')   pSm?: string | number;
  @Input('p.md')   pMd?: string | number;
  @Input('p.lg')   pLg?: string | number;

  // ── Dark mode ────────────────────────────────────────────────────────
  @Input('bg.dark')    bgDark?: string;
  @Input('color.dark') colorDark?: string;

  ngOnChanges(): void {
    this.applyStyles();
  }

  protected applyStyles(): void {
    const el = this.el.nativeElement as HTMLElement;
    this.applyCommonProps(el);
    this.applyResponsive(el);
    this.applyDarkMode(el);
  }

  protected applyCommonProps(el: HTMLElement): void {
    this.setStyle(el, 'background-color', this.bg ?? this.bgColor, 'color');
    this.setStyle(el, 'color',            this.color,              'color');
    this.setStyle(el, 'border-color',     this.borderColor,        'color');
    this.setStyle(el, 'padding',          this.p,                  'spacing');
    this.setStyle(el, 'padding-inline',   this.px,                 'spacing');
    this.setStyle(el, 'padding-block',    this.py,                 'spacing');
    this.setStyle(el, 'padding-top',      this.pt,                 'spacing');
    this.setStyle(el, 'padding-right',    this.pr,                 'spacing');
    this.setStyle(el, 'padding-bottom',   this.pb,                 'spacing');
    this.setStyle(el, 'padding-left',     this.pl,                 'spacing');
    this.setStyle(el, 'margin',           this.m,                  'spacing');
    this.setStyle(el, 'margin-inline',    this.mx,                 'spacing');
    this.setStyle(el, 'margin-block',     this.my,                 'spacing');
    this.setStyle(el, 'margin-top',       this.mt,                 'spacing');
    this.setStyle(el, 'margin-right',     this.mr,                 'spacing');
    this.setStyle(el, 'margin-bottom',    this.mb,                 'spacing');
    this.setStyle(el, 'margin-left',      this.ml,                 'spacing');
    this.setStyle(el, 'width',            this.w,                  'spacing');
    this.setStyle(el, 'height',           this.h,                  'spacing');
    this.setStyle(el, 'min-width',        this.minW,               'spacing');
    this.setStyle(el, 'max-width',        this.maxW,               'spacing');
    this.setStyle(el, 'min-height',       this.minH,               'spacing');
    this.setStyle(el, 'max-height',       this.maxH,               'spacing');
    this.setStyle(el, 'border-radius',    this.rounded,            'radius');
    this.setStyle(el, 'border-width',     this.border,             'raw');
    this.setStyle(el, 'box-shadow',       this.shadow,             'shadow');
    this.setStyle(el, 'opacity',          this.opacity,            'raw');
    this.setStyle(el, 'z-index',          this.zIndex,             'raw');
    this.setStyle(el, 'cursor',           this.cursor,             'raw');
    this.setStyle(el, 'overflow',         this.overflow,           'raw');
    this.setStyle(el, 'overflow-x',       this.overflowX,          'raw');
    this.setStyle(el, 'overflow-y',       this.overflowY,          'raw');
    this.setStyle(el, 'position',         this.position,           'raw');
  }

  protected applyResponsive(el: HTMLElement): void {
    // Responsive props use CSS custom properties + media queries via inline style
    // We inject a <style> scoped to this element's data attribute
    const responsive: Array<[string, string | number | undefined, string, string]> = [
      ['background-color', this.bgSm,  'color',   '@media(min-width:640px)'],
      ['background-color', this.bgMd,  'color',   '@media(min-width:768px)'],
      ['background-color', this.bgLg,  'color',   '@media(min-width:1024px)'],
      ['padding',          this.pSm,   'spacing', '@media(min-width:640px)'],
      ['padding',          this.pMd,   'spacing', '@media(min-width:768px)'],
      ['padding',          this.pLg,   'spacing', '@media(min-width:1024px)'],
    ];

    const hasResponsive = responsive.some(([,,, , ]) => responsive.some(r => r[1] !== undefined));
    if (!hasResponsive) return;

    // Generate unique attribute for scoping
    if (!el.dataset['chId']) {
      el.dataset['chId'] = Math.random().toString(36).slice(2, 8);
    }
    const id = el.dataset['chId'];

    const rules = responsive
      .filter(([, value]) => value !== undefined)
      .map(([prop, value, type, mq]) => {
        const resolved = this.resolve(value!, type as any);
        return `${mq}{[data-ch-id="${id}"]{${prop}:${resolved}}}`;
      })
      .join('');

    if (!rules) return;

    let styleEl = document.querySelector(`style[data-ch-id="${id}"]`) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-ch-id', id);
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = rules;
  }

  protected applyDarkMode(el: HTMLElement): void {
    if (this.bgDark || this.colorDark) {
      if (!el.dataset['chId']) {
        el.dataset['chId'] = Math.random().toString(36).slice(2, 8);
      }
      const id = el.dataset['chId'];

      const darkRules: string[] = [];
      if (this.bgDark)    darkRules.push(`background-color:${resolveColor(this.bgDark)}`);
      if (this.colorDark) darkRules.push(`color:${resolveColor(this.colorDark)}`);

      const rule = `.dark [data-ch-id="${id}"],[data-ch-color-mode="dark"] [data-ch-id="${id}"]{${darkRules.join(';')}}`;

      const existing = document.querySelector(`style[data-ch-dark="${id}"]`) as HTMLStyleElement | null;
      const darkStyle = existing ?? (() => {
        const s = document.createElement('style');
        s.setAttribute('data-ch-dark', id);
        document.head.appendChild(s);
        return s;
      })();
      darkStyle.textContent = rule;
    }
  }

  protected setStyle(
    el: HTMLElement,
    property: string,
    value: string | number | undefined,
    type: 'color' | 'spacing' | 'radius' | 'shadow' | 'raw'
  ): void {
    if (value === undefined || value === null || value === '') return;
    const resolved = this.resolve(value, type);
    this.renderer.setStyle(el, property, resolved);
  }

  protected resolve(
    value: string | number,
    type: 'color' | 'spacing' | 'radius' | 'shadow' | 'raw'
  ): string {
    const str = String(value);
    switch (type) {
      case 'color':   return resolveColor(str);
      case 'spacing': return resolveSpacing(str);
      case 'radius':  return resolveRadius(str);
      case 'shadow':  return resolveShadow(str);
      default:        return str;
    }
  }
}
