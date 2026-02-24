import { Directive, Input, OnChanges } from '@angular/core';
import { BaseStylePropsDirective } from './base-style-props.directive';

const FONT_SIZE_MAP: Record<string, string> = {
  xs:   'var(--ch-text-xs)',
  sm:   'var(--ch-text-sm)',
  md:   'var(--ch-text-md)',
  lg:   'var(--ch-text-lg)',
  xl:   'var(--ch-text-xl)',
  '2xl':'var(--ch-text-2xl)',
  '3xl':'var(--ch-text-3xl)',
  '4xl':'var(--ch-text-4xl)',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  normal:   'var(--ch-weight-normal)',
  medium:   'var(--ch-weight-medium)',
  semibold: 'var(--ch-weight-semibold)',
  bold:     'var(--ch-weight-bold)',
};

const LINE_HEIGHT_MAP: Record<string, string> = {
  tight:  'var(--ch-leading-tight)',
  normal: 'var(--ch-leading-normal)',
  loose:  'var(--ch-leading-loose)',
};

/**
 * `chText` — typography directive.
 *
 * @example
 * <p chText fontSize="xl" fontWeight="bold" color="primary" lineHeight="tight">
 *   Hello World
 * </p>
 */
@Directive({
  selector: '[chText]',
  standalone: true,
})
export class ChTextDirective extends BaseStylePropsDirective implements OnChanges {
  /** Font size — uses theme scale: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' */
  @Input() fontSize?: string;

  /** Font weight */
  @Input() fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | string;

  /** Line height */
  @Input() lineHeight?: 'tight' | 'normal' | 'loose' | string;

  /** Text alignment */
  @Input() textAlign?: 'left' | 'center' | 'right' | 'justify';

  /** Text decoration */
  @Input() textDecoration?: string;

  /** Text transform */
  @Input() textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

  /** Letter spacing */
  @Input() letterSpacing?: string;

  /** Font family */
  @Input() fontFamily?: 'body' | 'heading' | 'mono' | string;

  /** Truncate text with ellipsis */
  @Input() noOfLines?: number;

  override applyStyles(): void {
    super.applyStyles();
    const el = this.el.nativeElement as HTMLElement;

    if (this.fontSize) {
      const size = FONT_SIZE_MAP[this.fontSize] ?? this.fontSize;
      this.renderer.setStyle(el, 'font-size', size);
    }

    if (this.fontWeight) {
      const weight = FONT_WEIGHT_MAP[this.fontWeight] ?? this.fontWeight;
      this.renderer.setStyle(el, 'font-weight', weight);
    }

    if (this.lineHeight) {
      const lh = LINE_HEIGHT_MAP[this.lineHeight] ?? this.lineHeight;
      this.renderer.setStyle(el, 'line-height', lh);
    }

    if (this.textAlign)     this.renderer.setStyle(el, 'text-align',      this.textAlign);
    if (this.textDecoration) this.renderer.setStyle(el, 'text-decoration', this.textDecoration);
    if (this.textTransform) this.renderer.setStyle(el, 'text-transform',   this.textTransform);
    if (this.letterSpacing) this.renderer.setStyle(el, 'letter-spacing',   this.letterSpacing);

    if (this.fontFamily) {
      const fontMap: Record<string, string> = {
        body:    'var(--ch-font-body)',
        heading: 'var(--ch-font-heading)',
        mono:    'var(--ch-font-mono)',
      };
      this.renderer.setStyle(el, 'font-family', fontMap[this.fontFamily] ?? this.fontFamily);
    }

    if (this.noOfLines) {
      this.renderer.setStyle(el, 'overflow',         'hidden');
      this.renderer.setStyle(el, '-webkit-box-orient','vertical');
      this.renderer.setStyle(el, 'display',           '-webkit-box');
      this.renderer.setStyle(el, '-webkit-line-clamp', String(this.noOfLines));
    }
  }
}
