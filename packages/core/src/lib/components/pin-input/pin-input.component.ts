import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  signal,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type PinInputSize = 'sm' | 'md' | 'lg';
export type PinInputType = 'text' | 'number';

@Component({
  selector: 'ch-pin-input',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinInputComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="ch-pin-input"
      [class.ch-pin-input--sm]="size === 'sm'"
      [class.ch-pin-input--md]="size === 'md'"
      [class.ch-pin-input--lg]="size === 'lg'"
      [class.ch-pin-input--masked]="mask"
      [class.ch-pin-input--disabled]="isDisabled()"
    >
      @for (digit of digits(); track $index) {
        <input
          #pinInput
          class="ch-pin-input__box"
          [attr.maxlength]="1"
          [attr.inputmode]="type === 'number' ? 'numeric' : 'text'"
          [attr.placeholder]="placeholder"
          [attr.aria-label]="'Pin digit ' + ($index + 1) + ' of ' + length"
          [disabled]="isDisabled()"
          [value]="digit"
          (input)="onInput($event, $index)"
          (keydown)="onKeyDown($event, $index)"
          (paste)="onPaste($event, $index)"
          (focus)="onFocus($index)"
          autocomplete="one-time-code"
        />
      }
    </div>
  `,
  styles: [`
    .ch-pin-input {
      display: inline-flex;
      gap: var(--ch-space-2, 8px);
      align-items: center;
    }

    .ch-pin-input__box {
      text-align: center;
      border: 1px solid var(--ch-border, #d1d5db);
      border-radius: var(--ch-radius-md, 6px);
      outline: none;
      background: var(--ch-input-bg, #ffffff);
      color: var(--ch-input-text, #111827);
      font-family: inherit;
      padding: 0;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      -moz-appearance: textfield;
    }

    .ch-pin-input__box::-webkit-outer-spin-button,
    .ch-pin-input__box::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .ch-pin-input__box::placeholder {
      color: var(--ch-placeholder, #9ca3af);
      opacity: 1;
    }

    .ch-pin-input__box:focus {
      border-color: var(--ch-primary, #3b82f6);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-primary, #3b82f6) 20%, transparent);
    }

    .ch-pin-input__box:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--ch-input-disabled-bg, #f3f4f6);
    }

    /* Size: sm - 32px */
    .ch-pin-input--sm .ch-pin-input__box {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    /* Size: md - 40px (default) */
    .ch-pin-input--md .ch-pin-input__box,
    .ch-pin-input:not(.ch-pin-input--sm):not(.ch-pin-input--lg) .ch-pin-input__box {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }

    /* Size: lg - 48px */
    .ch-pin-input--lg .ch-pin-input__box {
      width: 48px;
      height: 48px;
      font-size: 22px;
    }

    /* Masked mode */
    .ch-pin-input--masked .ch-pin-input__box {
      -webkit-text-security: disc;
    }

    /* Fallback for browsers that do not support -webkit-text-security */
    @supports not (-webkit-text-security: disc) {
      .ch-pin-input--masked .ch-pin-input__box {
        font-family: "dotsfont", text, sans-serif;
        letter-spacing: -2px;
      }
    }

    /* Disabled wrapper */
    .ch-pin-input--disabled {
      pointer-events: none;
    }
  `],
})
export class PinInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() length = 4;
  @Input() type: PinInputType = 'number';
  @Input() mask = false;
  @Input() size: PinInputSize = 'md';
  @Input() disabled = false;
  @Input() placeholder = '○';

  @Output() valueChange = new EventEmitter<string>();
  @Output() completed = new EventEmitter<string>();

  @ViewChildren('pinInput') pinInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /** Internal signal holding the array of individual digit values. */
  private readonly _digits = signal<string[]>([]);

  /** Computed signal exposing the digits array for the template. */
  readonly digits = computed(() => {
    const d = this._digits();
    // Ensure the array always matches the configured length.
    if (d.length === this.length) {
      return d;
    }
    const padded = Array.from({ length: this.length }, (_, i) => d[i] ?? '');
    return padded;
  });

  /** Whether the control is disabled (reactive wrapper). */
  readonly isDisabled = signal(false);

  /** ControlValueAccessor callbacks. */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /** Track focused index for potential external use. */
  private focusedIndex = -1;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngAfterViewInit(): void {
    // Ensure digits array is initialised after the view is ready.
    if (this._digits().length !== this.length) {
      this._digits.set(Array.from({ length: this.length }, () => ''));
    }
  }

  ngOnDestroy(): void {
    // Cleanup - nothing async to tear down, but satisfies best-practice.
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  writeValue(value: string | null | undefined): void {
    const str = (value ?? '').slice(0, this.length);
    const arr = Array.from({ length: this.length }, (_, i) => str[i] ?? '');
    this._digits.set(arr);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let char = input.value;

    // When type is 'number', allow only digits.
    if (this.type === 'number') {
      char = char.replace(/[^0-9]/g, '');
    }

    // Take only the last character (handles quick double-type).
    char = char.slice(-1);

    this.setDigit(index, char);

    // Auto-focus the next input if a character was entered.
    if (char && index < this.length - 1) {
      this.focusInput(index + 1);
    }

    this.emitValue();
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const key = event.key;

    switch (key) {
      case 'Backspace': {
        const current = this._digits();
        if (!current[index] && index > 0) {
          // Current box is empty - move to previous and clear it.
          this.setDigit(index - 1, '');
          this.focusInput(index - 1);
        } else {
          // Clear current box.
          this.setDigit(index, '');
        }
        this.emitValue();
        event.preventDefault();
        break;
      }
      case 'ArrowLeft':
        if (index > 0) {
          this.focusInput(index - 1);
        }
        event.preventDefault();
        break;
      case 'ArrowRight':
        if (index < this.length - 1) {
          this.focusInput(index + 1);
        }
        event.preventDefault();
        break;
      case 'Delete': {
        this.setDigit(index, '');
        this.emitValue();
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();

    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    if (!pasted) {
      return;
    }

    let chars = pasted.split('');

    // Filter to digits only when type is 'number'.
    if (this.type === 'number') {
      chars = chars.filter((c) => /^[0-9]$/.test(c));
    }

    // Distribute pasted characters starting from the current index.
    const current = [...this._digits()];
    let lastFilledIndex = index;
    for (let i = 0; i < chars.length && index + i < this.length; i++) {
      current[index + i] = chars[i];
      lastFilledIndex = index + i;
    }
    this._digits.set(current);

    // Focus the next empty box, or the last filled one.
    const nextEmpty = current.findIndex((d, i) => i > lastFilledIndex && !d);
    if (nextEmpty !== -1) {
      this.focusInput(nextEmpty);
    } else {
      this.focusInput(Math.min(lastFilledIndex, this.length - 1));
    }

    this.emitValue();
  }

  onFocus(index: number): void {
    this.focusedIndex = index;
    this.onTouched();

    // Select text in the focused input for easy overwriting.
    const inputs = this.pinInputs?.toArray();
    if (inputs?.[index]) {
      inputs[index].nativeElement.select();
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private setDigit(index: number, value: string): void {
    const current = [...this._digits()];
    // Pad array if needed (safety).
    while (current.length < this.length) {
      current.push('');
    }
    current[index] = value;
    this._digits.set(current);

    // Sync the native input value to prevent stale display.
    const inputs = this.pinInputs?.toArray();
    if (inputs?.[index]) {
      inputs[index].nativeElement.value = value;
    }
  }

  private focusInput(index: number): void {
    const inputs = this.pinInputs?.toArray();
    if (inputs?.[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  private emitValue(): void {
    const value = this._digits().join('');
    this.onChange(value);
    this.valueChange.emit(value);

    // Emit completed only when all boxes are filled.
    if (value.length === this.length && this._digits().every((d) => d !== '')) {
      this.completed.emit(value);
    }
  }
}
