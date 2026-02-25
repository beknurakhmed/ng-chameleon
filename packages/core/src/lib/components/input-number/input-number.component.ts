import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type InputNumberSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ch-input-number',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="ch-input-number"
      [class.ch-input-number--sm]="size === 'sm'"
      [class.ch-input-number--md]="size === 'md'"
      [class.ch-input-number--lg]="size === 'lg'"
      [class.ch-input-number--disabled]="disabled"
    >
      <label
        *ngIf="label"
        class="ch-input-number__label"
      >
        {{ label }}
      </label>

      <div class="ch-input-number__row">
        <button
          type="button"
          class="ch-input-number__btn ch-input-number__btn--decrement"
          [disabled]="disabled || isAtMin()"
          (click)="decrement()"
          aria-label="Decrement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <input
          type="text"
          class="ch-input-number__input"
          [attr.placeholder]="placeholder"
          [disabled]="disabled"
          [value]="displayValue()"
          pattern="[0-9]*\.?[0-9]*"
          inputmode="decimal"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
        />

        <button
          type="button"
          class="ch-input-number__btn ch-input-number__btn--increment"
          [disabled]="disabled || isAtMax()"
          (click)="increment()"
          aria-label="Increment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <span
        *ngIf="helperText"
        class="ch-input-number__helper"
      >
        {{ helperText }}
      </span>
    </div>
  `,
  styles: [`
    .ch-input-number {
      display: inline-flex;
      flex-direction: column;
      gap: 4px;
      font-family: inherit;
    }

    .ch-input-number__label {
      font-size: var(--ch-text-sm, 0.875rem);
      color: var(--ch-text, #1a1a1a);
      font-weight: 500;
      margin-bottom: 2px;
    }

    .ch-input-number__row {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--ch-border, #d1d5db);
      border-radius: var(--ch-radius-md, 6px);
      overflow: hidden;
      background: var(--ch-bg, #ffffff);
      transition: border-color var(--ch-transition-fast, 150ms) ease;
    }

    .ch-input-number__row:focus-within {
      border-color: var(--ch-primary, #6366f1);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
    }

    .ch-input-number__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--ch-text, #1a1a1a);
      cursor: pointer;
      padding: 0 10px;
      flex-shrink: 0;
      transition:
        background var(--ch-transition-fast, 150ms) ease,
        color var(--ch-transition-fast, 150ms) ease;
    }

    .ch-input-number__btn:hover:not(:disabled) {
      background: var(--ch-primary, #6366f1);
      color: #ffffff;
    }

    .ch-input-number__btn:active:not(:disabled) {
      opacity: 0.85;
    }

    .ch-input-number__btn:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .ch-input-number__btn--decrement {
      border-right: 1px solid var(--ch-border, #d1d5db);
    }

    .ch-input-number__btn--increment {
      border-left: 1px solid var(--ch-border, #d1d5db);
    }

    .ch-input-number__input {
      border: none;
      outline: none;
      background: transparent;
      text-align: center;
      color: var(--ch-text, #1a1a1a);
      font-size: var(--ch-text-sm, 0.875rem);
      width: 64px;
      padding: 0 4px;
      -moz-appearance: textfield;
    }

    .ch-input-number__input::placeholder {
      color: var(--ch-text, #1a1a1a);
      opacity: 0.45;
    }

    .ch-input-number__input::-webkit-outer-spin-button,
    .ch-input-number__input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .ch-input-number--sm .ch-input-number__row {
      height: var(--ch-input-height-sm, 30px);
    }

    .ch-input-number--sm .ch-input-number__btn {
      padding: 0 8px;
    }

    .ch-input-number--md .ch-input-number__row {
      height: var(--ch-input-height-md, 38px);
    }

    .ch-input-number--lg .ch-input-number__row {
      height: var(--ch-input-height-lg, 46px);
    }

    .ch-input-number--lg .ch-input-number__btn {
      padding: 0 12px;
    }

    .ch-input-number--lg .ch-input-number__input {
      width: 80px;
      font-size: 1rem;
    }

    .ch-input-number--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .ch-input-number__helper {
      font-size: var(--ch-text-sm, 0.875rem);
      color: var(--ch-text, #1a1a1a);
      opacity: 0.65;
    }
  `],
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() step: number = 1;
  @Input() size: InputNumberSize = 'md';
  @Input() disabled: boolean = false;
  @Input() label: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() precision: number | undefined;
  @Input() helperText: string | undefined;

  @Output() valueChange = new EventEmitter<number>();

  readonly value = signal<number | null>(null);

  readonly displayValue = computed<string>(() => {
    const v = this.value();
    if (v === null || v === undefined) {
      return '';
    }
    if (this.precision !== undefined && this.precision !== null) {
      return v.toFixed(this.precision);
    }
    return String(v);
  });

  readonly isAtMin = computed<boolean>(() => {
    const v = this.value();
    if (v === null || this.min === undefined || this.min === null) {
      return false;
    }
    return v <= this.min;
  });

  readonly isAtMax = computed<boolean>(() => {
    const v = this.value();
    if (v === null || this.max === undefined || this.max === null) {
      return false;
    }
    return v >= this.max;
  });

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  increment(): void {
    const current = this.value() ?? 0;
    this.setValue(current + this.step);
  }

  decrement(): void {
    const current = this.value() ?? 0;
    this.setValue(current - this.step);
  }

  onInputChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    if (raw === '' || raw === '-') {
      this.value.set(null);
      this.onChange(null);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      this.setValue(parsed);
    }
  }

  onBlur(): void {
    this.onTouched();
    const v = this.value();
    if (v !== null) {
      this.setValue(v);
    }
  }

  private setValue(raw: number): void {
    let clamped = raw;

    if (this.min !== undefined && this.min !== null) {
      clamped = Math.max(clamped, this.min);
    }
    if (this.max !== undefined && this.max !== null) {
      clamped = Math.min(clamped, this.max);
    }
    if (this.precision !== undefined && this.precision !== null) {
      clamped = parseFloat(clamped.toFixed(this.precision));
    }

    this.value.set(clamped);
    this.onChange(clamped);
    this.valueChange.emit(clamped);
  }
}
