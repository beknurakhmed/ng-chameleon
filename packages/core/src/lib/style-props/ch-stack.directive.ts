import { Directive, Input, OnChanges } from '@angular/core';
import { BaseStylePropsDirective } from './base-style-props.directive';
import { resolveSpacing } from '../utils/token-resolver.util';

/**
 * `chStack` — vertical or horizontal stack with even spacing.
 *
 * @example
 * <div chStack spacing="4" direction="column">
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 * </div>
 */
@Directive({
  selector: '[chStack]',
  standalone: true,
  host: { style: 'display:flex' },
})
export class ChStackDirective extends BaseStylePropsDirective implements OnChanges {
  /** Stack direction — defaults to 'column' */
  @Input() direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'column';

  /** Gap between items */
  @Input() spacing?: string | number;

  /** align-items */
  @Input() align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' = 'stretch';

  /** justify-content */
  @Input() justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

  /** Whether to show dividers between items */
  @Input() divider?: boolean = false;

  /** Reverse the order */
  @Input() isReversed?: boolean = false;

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

    const dir = this.isReversed
      ? (this.direction === 'column' ? 'column-reverse' : 'row-reverse')
      : (this.direction ?? 'column');

    this.renderer.setStyle(el, 'flex-direction', dir);

    if (this.spacing !== undefined) {
      this.renderer.setStyle(el, 'gap', resolveSpacing(this.spacing));
    }

    const align = this.align ? (this.ALIGN_MAP[this.align] ?? this.align) : 'stretch';
    this.renderer.setStyle(el, 'align-items', align);

    if (this.justify) {
      this.renderer.setStyle(el, 'justify-content', this.JUSTIFY_MAP[this.justify] ?? this.justify);
    }
  }
}
