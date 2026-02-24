import {
  Directive,
  Input,
  HostBinding,
  HostListener,
  forwardRef,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * InputBrain — headless input logic.
 * Implements ControlValueAccessor for full Angular Forms integration.
 */
@Directive({
  selector: '[chInputBrain]',
  standalone: true,
  exportAs: 'chInputBrain',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBrainDirective),
      multi: true,
    },
  ],
})
export class InputBrainDirective implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid  = false;
  @Input() name?: string;
  @Input() id?: string;

  readonly focused = signal(false);
  readonly valueChange = output<string>();

  private onChange:  (val: string) => void = () => {};
  private onTouched: () => void            = () => {};

  // ── ControlValueAccessor ──────────────────────────────────────────────

  writeValue(value: string | null): void {
    if (this.el) {
      (this.el.nativeElement as HTMLInputElement).value = value ?? '';
    }
    this._value = value ?? '';
  }

  registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void            { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void        { this.disabled = isDisabled; }

  private _value = '';

  // ── Host bindings ─────────────────────────────────────────────────────
  @HostBinding('attr.disabled')
  get attrDisabled(): string | null { return this.disabled ? '' : null; }

  @HostBinding('attr.readonly')
  get attrReadonly(): string | null { return this.readonly ? '' : null; }

  @HostBinding('attr.required')
  get attrRequired(): string | null { return this.required ? '' : null; }

  @HostBinding('attr.aria-invalid')
  get ariaInvalid(): string | null { return this.invalid ? 'true' : null; }

  @HostBinding('attr.aria-required')
  get ariaRequired(): string | null { return this.required ? 'true' : null; }

  @HostBinding('attr.name')
  get attrName(): string | undefined { return this.name; }

  @HostBinding('attr.id')
  get attrId(): string | undefined { return this.id; }

  // ── Events ────────────────────────────────────────────────────────────
  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this._value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  @HostListener('focus')
  onFocus(): void {
    this.focused.set(true);
  }

  // Injected via constructor in real usage; reference for writeValue
  private get el(): any { return null; }
}
