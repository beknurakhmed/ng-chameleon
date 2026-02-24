import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';

export type CheckboxVariant = 'default' | 'filled';

@Component({
  selector: 'ch-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'ch-checkbox-host',
    '[class.ch-checkbox-host--disabled]': 'disabled',
  },
  template: `
    <label class="ch-checkbox" [class.ch-checkbox--disabled]="disabled">
      <span class="ch-checkbox__control"
        [class]="controlClass()"
        [class.ch-checkbox--checked]="checked()"
        [class.ch-checkbox--indeterminate]="indeterminate"
        role="checkbox"
        [attr.aria-checked]="indeterminate ? 'mixed' : checked()"
        [attr.aria-disabled]="disabled || null"
        [attr.tabindex]="disabled ? -1 : 0"
        (click)="toggle()"
        (keydown.space)="$event.preventDefault(); toggle()">

        <input
          type="checkbox"
          class="ch-checkbox__input"
          [checked]="checked()"
          [disabled]="disabled"
          [indeterminate]="indeterminate"
          (change)="toggle()"
          aria-hidden="true">

        <!-- Checkmark icon -->
        <svg *ngIf="checked() && !indeterminate"
          class="ch-checkbox__icon"
          viewBox="0 0 12 10" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- Indeterminate icon -->
        <svg *ngIf="indeterminate"
          class="ch-checkbox__icon"
          viewBox="0 0 10 2" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>

      <span *ngIf="label" class="ch-checkbox__label" [class.ch-checkbox__label--sm]="size === 'sm'"
        [class.ch-checkbox__label--lg]="size === 'lg'">{{ label }}</span>
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    .ch-checkbox-host { display: inline-flex; }

    .ch-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-2);
      cursor: pointer;
      user-select: none;
      &--disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .ch-checkbox__input {
      position: absolute;
      width: 1px; height: 1px;
      padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0);
      white-space: nowrap; border: 0;
    }

    .ch-checkbox__control {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem; height: 1rem;
      border: 2px solid var(--ch-border-strong, var(--ch-border));
      border-radius: var(--ch-radius-sm);
      background: var(--ch-bg);
      color: var(--ch-bg);
      transition: all var(--ch-transition-fast);
      flex-shrink: 0;

      &--sm  { width: 0.875rem; height: 0.875rem; }
      &--lg  { width: 1.25rem;  height: 1.25rem;  }

      &.ch-checkbox--checked,
      &.ch-checkbox--indeterminate {
        background: var(--ch-primary);
        border-color: var(--ch-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--ch-primary);
        outline-offset: 2px;
      }
    }

    .ch-checkbox__icon {
      width: 70%; height: 70%;
      pointer-events: none;
    }

    .ch-checkbox__label {
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      &--sm { font-size: var(--ch-text-xs); }
      &--lg { font-size: var(--ch-text-md); }
    }
  `],
})
export class ChCheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() size: ChameleonSize = 'md';
  @Input() colorScheme: ChameleonColorScheme = 'primary';
  @Input() indeterminate = false;
  @Input() set disabled(v: boolean) { this._disabled.set(v); }
  get disabled() { return this._disabled(); }

  @Output() changed = new EventEmitter<boolean>();

  private _checked  = signal(false);
  private _disabled = signal(false);

  readonly checked  = this._checked.asReadonly();

  readonly controlClass = computed(() => {
    const classes = [`ch-checkbox__control`];
    if (this.size !== 'md') classes.push(`ch-checkbox__control--${this.size}`);
    return classes.join(' ');
  });

  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  toggle(): void {
    if (this._disabled()) return;
    const next = !this._checked();
    this._checked.set(next);
    this._onChange(next);
    this._onTouched();
    this.changed.emit(next);
  }

  writeValue(v: boolean): void     { this._checked.set(!!v); }
  registerOnChange(fn: any): void  { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this._disabled.set(d); }
}
