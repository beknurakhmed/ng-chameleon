import { Directive, Input, OnChanges } from '@angular/core';
import { BaseStylePropsDirective } from './base-style-props.directive';
import { resolveSpacing } from '../utils/token-resolver.util';

/**
 * `chFlex` — flexbox container directive.
 *
 * @example
 * <div chFlex direction="row" gap="4" align="center" justify="between" wrap="wrap">
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 * </div>
 */
@Directive({
  selector: '[chFlex]',
  standalone: true,
  host: { style: 'display:flex' },
})
export class ChFlexDirective extends BaseStylePropsDirective implements OnChanges {
  /** flex-direction */
  @Input() direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

  /** gap (uses spacing scale) */
  @Input() gap?: string | number;
  @Input() gapX?: string | number;
  @Input() gapY?: string | number;

  /** align-items */
  @Input() align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /** justify-content */
  @Input() justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

  /** flex-wrap */
  @Input() wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';

  /** flex (for children) */
  @Input() flex?: string;
  @Input() grow?: string | number;
  @Input() shrink?: string | number;
  @Input() basis?: string;

  private readonly JUSTIFY_MAP: Record<string, string> = {
    start:   'flex-start',
    end:     'flex-end',
    center:  'center',
    between: 'space-between',
    around:  'space-around',
    evenly:  'space-evenly',
  };

  private readonly ALIGN_MAP: Record<string, string> = {
    start:    'flex-start',
    end:      'flex-end',
    center:   'center',
    baseline: 'baseline',
    stretch:  'stretch',
  };

  override applyStyles(): void {
    super.applyStyles();
    const el = this.el.nativeElement as HTMLElement;

    if (this.direction) this.renderer.setStyle(el, 'flex-direction', this.direction);
    if (this.gap)       this.renderer.setStyle(el, 'gap',             resolveSpacing(this.gap));
    if (this.gapX)      this.renderer.setStyle(el, 'column-gap',      resolveSpacing(this.gapX));
    if (this.gapY)      this.renderer.setStyle(el, 'row-gap',         resolveSpacing(this.gapY));
    if (this.align)     this.renderer.setStyle(el, 'align-items',     this.ALIGN_MAP[this.align] ?? this.align);
    if (this.justify)   this.renderer.setStyle(el, 'justify-content', this.JUSTIFY_MAP[this.justify] ?? this.justify);
    if (this.wrap)      this.renderer.setStyle(el, 'flex-wrap',        this.wrap);
    if (this.flex)      this.renderer.setStyle(el, 'flex',             this.flex);
    if (this.grow !== undefined) this.renderer.setStyle(el, 'flex-grow',   String(this.grow));
    if (this.shrink !== undefined) this.renderer.setStyle(el, 'flex-shrink', String(this.shrink));
    if (this.basis)     this.renderer.setStyle(el, 'flex-basis',       this.basis);
  }
}
