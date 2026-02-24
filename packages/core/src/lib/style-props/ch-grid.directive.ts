import { Directive, Input, OnChanges } from '@angular/core';
import { BaseStylePropsDirective } from './base-style-props.directive';
import { resolveSpacing } from '../utils/token-resolver.util';

/**
 * `chGrid` — CSS Grid container directive.
 *
 * @example
 * <div chGrid cols="3" gap="4" rows="auto">
 *   <div>Cell 1</div>
 *   <div>Cell 2</div>
 *   <div>Cell 3</div>
 * </div>
 */
@Directive({
  selector: '[chGrid]',
  standalone: true,
  host: { style: 'display:grid' },
})
export class ChGridDirective extends BaseStylePropsDirective implements OnChanges {
  /** Number of columns or template string */
  @Input() cols?: string | number;

  /** Number of rows or template string */
  @Input() rows?: string | number;

  /** gap */
  @Input() gap?: string | number;
  @Input() gapX?: string | number;
  @Input() gapY?: string | number;

  /** align-items */
  @Input() align?: 'start' | 'end' | 'center' | 'stretch';

  /** justify-items */
  @Input() justify?: 'start' | 'end' | 'center' | 'stretch';

  /** Column span (for child elements) */
  @Input() colSpan?: string | number;
  @Input() rowSpan?: string | number;

  override applyStyles(): void {
    super.applyStyles();
    const el = this.el.nativeElement as HTMLElement;

    if (this.cols !== undefined) {
      const cols = typeof this.cols === 'number' || /^\d+$/.test(String(this.cols))
        ? `repeat(${this.cols}, minmax(0, 1fr))`
        : String(this.cols);
      this.renderer.setStyle(el, 'grid-template-columns', cols);
    }

    if (this.rows !== undefined) {
      const rows = typeof this.rows === 'number' || /^\d+$/.test(String(this.rows))
        ? `repeat(${this.rows}, minmax(0, 1fr))`
        : String(this.rows);
      this.renderer.setStyle(el, 'grid-template-rows', rows);
    }

    if (this.gap)     this.renderer.setStyle(el, 'gap',           resolveSpacing(this.gap));
    if (this.gapX)    this.renderer.setStyle(el, 'column-gap',    resolveSpacing(this.gapX));
    if (this.gapY)    this.renderer.setStyle(el, 'row-gap',       resolveSpacing(this.gapY));
    if (this.align)   this.renderer.setStyle(el, 'align-items',   this.align);
    if (this.justify) this.renderer.setStyle(el, 'justify-items', this.justify);

    if (this.colSpan !== undefined) {
      this.renderer.setStyle(el, 'grid-column', `span ${this.colSpan} / span ${this.colSpan}`);
    }
    if (this.rowSpan !== undefined) {
      this.renderer.setStyle(el, 'grid-row', `span ${this.rowSpan} / span ${this.rowSpan}`);
    }
  }
}
