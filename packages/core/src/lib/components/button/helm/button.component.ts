import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  output,
  computed,
  signal,
} from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { buttonVariants, COLOR_SCHEME_VARS, ButtonVariant, ButtonColorScheme, ButtonSize } from '../button.variants';
import { ButtonBrainDirective, ButtonType } from '../brain/button-brain.directive';

/**
 * ChButtonComponent — the styled button.
 *
 * @example
 * <ch-button variant="solid" colorScheme="primary" size="md">
 *   Click me
 * </ch-button>
 *
 * <ch-button variant="outline" colorScheme="success" [loading]="saving">
 *   Save
 * </ch-button>
 */
@Component({
  selector: 'ch-button',
  standalone: true,
  imports: [NgIf, NgClass, ButtonBrainDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[style]': 'hostStyle()',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-busy]': 'loading ? "true" : null',
    '[attr.type]': 'type',
    'role': 'button',
    '(click)': 'handleClick($event)',
    '(keydown.enter)': 'handleKeydown($event)',
    '(keydown.space)': 'handleKeydown($event)',
  },
  template: `
    <span *ngIf="loading" class="ch-btn-spinner" aria-hidden="true">
      <svg
        width="1em" height="1em" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        style="animation: ch-spin 0.75s linear infinite">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
    </span>

    <span *ngIf="leftIcon && !loading" class="ch-btn-icon ch-btn-icon-left" aria-hidden="true">
      <ng-content select="[chButtonLeftIcon]"/>
    </span>

    <ng-content/>

    <span *ngIf="rightIcon" class="ch-btn-icon ch-btn-icon-right" aria-hidden="true">
      <ng-content select="[chButtonRightIcon]"/>
    </span>
  `,
})
export class ChButtonComponent {
  @Input() variant: ButtonVariant = 'solid';
  @Input() colorScheme: ButtonColorScheme = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconOnly = false;
  @Input() type: ButtonType = 'button';
  @Input() leftIcon = false;
  @Input() rightIcon = false;

  readonly clicked = output<MouseEvent>();

  readonly isDisabled = computed(() => this.disabled || this.loading);

  readonly hostClass = computed(() =>
    buttonVariants({
      variant:     this.variant,
      size:        this.size,
      isFullWidth: this.fullWidth ? 'true' : 'false',
      isIconOnly:  this.iconOnly  ? 'true' : 'false',
    })
  );

  readonly hostStyle = computed(() => {
    const vars = COLOR_SCHEME_VARS[this.colorScheme];
    return vars || null;
  });

  handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
