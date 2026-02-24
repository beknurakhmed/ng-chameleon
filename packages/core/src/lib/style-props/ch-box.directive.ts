import { Directive, Input, OnChanges } from '@angular/core';
import { BaseStylePropsDirective } from './base-style-props.directive';

/**
 * `chBox` — generic container styling directive.
 *
 * @example
 * <div chBox bg="primary.500" p="4" rounded="lg" shadow="md">
 *   Content
 * </div>
 */
@Directive({
  selector: '[chBox]',
  standalone: true,
})
export class ChBoxDirective extends BaseStylePropsDirective implements OnChanges {
  @Input() display?: string;

  override applyStyles(): void {
    super.applyStyles();
    const el = this.el.nativeElement as HTMLElement;
    if (this.display) this.renderer.setStyle(el, 'display', this.display);
  }
}
