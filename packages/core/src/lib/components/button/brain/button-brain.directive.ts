import {
  Directive,
  Input,
  HostBinding,
  HostListener,
  signal,
  computed,
  output,
} from '@angular/core';

export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * ButtonBrain — headless button logic.
 * Handles: disabled state, loading state, ARIA, focus, click events.
 * No styles applied here.
 */
@Directive({
  selector: '[chButtonBrain]',
  standalone: true,
  exportAs: 'chButtonBrain',
})
export class ButtonBrainDirective {
  @Input() disabled = false;
  @Input() loading  = false;
  @Input() type: ButtonType = 'button';

  readonly clicked = output<MouseEvent>();

  readonly isDisabled = computed(() => this.disabled || this.loading);

  // ── Host bindings ─────────────────────────────────────────────────────
  @HostBinding('attr.disabled')
  get attrDisabled(): string | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): string | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.aria-busy')
  get ariaBusy(): string | null {
    return this.loading ? 'true' : null;
  }

  @HostBinding('attr.type')
  get attrType(): ButtonType {
    return this.type;
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'button';
  }

  // ── Keyboard ──────────────────────────────────────────────────────────
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault(); // Prevent scroll on space
      (event.target as HTMLElement).click();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
