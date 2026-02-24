import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
  computed,
  output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { inputVariants, InputVariant, InputSize } from '../input.variants';

/**
 * ChInputComponent — styled input with full ControlValueAccessor support.
 *
 * @example
 * <!-- Template-driven -->
 * <ch-input placeholder="Search..." [(ngModel)]="search" />
 *
 * <!-- Reactive -->
 * <ch-input [formControl]="searchCtrl" variant="filled" size="lg" />
 *
 * <!-- With error state -->
 * <ch-input [invalid]="nameCtrl.invalid && nameCtrl.touched" errorMessage="Name is required" />
 */
@Component({
  selector: 'ch-input',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ch-input-wrapper" [class.ch-input-wrapper--focused]="focused()" [class.ch-input-wrapper--invalid]="invalid">

      <!-- Left addon slot -->
      <div *ngIf="hasLeftAddon" class="ch-input-addon ch-input-addon--left">
        <ng-content select="[chInputLeftAddon]"/>
      </div>

      <!-- Left element (icon inside input) -->
      <div *ngIf="hasLeftElement" class="ch-input-element ch-input-element--left" aria-hidden="true">
        <ng-content select="[chInputLeftElement]"/>
      </div>

      <!-- The actual input -->
      <input
        #inputEl
        [class]="inputClass()"
        [class.pl-9]="hasLeftElement"
        [class.pr-9]="hasRightElement"
        [placeholder]="placeholder"
        [disabled]="isDisabled()"
        [readonly]="readonly"
        [required]="required"
        [attr.id]="id"
        [attr.name]="name"
        [attr.type]="type"
        [attr.autocomplete]="autocomplete"
        [attr.aria-invalid]="invalid ? 'true' : null"
        [attr.aria-required]="required ? 'true' : null"
        [attr.aria-label]="ariaLabel"
        [attr.aria-describedby]="errorId || null"
        [value]="value()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />

      <!-- Right element (icon inside input) -->
      <div *ngIf="hasRightElement" class="ch-input-element ch-input-element--right" aria-hidden="true">
        <ng-content select="[chInputRightElement]"/>
      </div>

      <!-- Right addon slot -->
      <div *ngIf="hasRightAddon" class="ch-input-addon ch-input-addon--right">
        <ng-content select="[chInputRightAddon]"/>
      </div>

    </div>

    <!-- Helper text -->
    <p *ngIf="helperText && !invalid" class="ch-input-helper" aria-live="polite">
      {{ helperText }}
    </p>

    <!-- Error message -->
    <p *ngIf="errorMessage && invalid"
       class="ch-input-error"
       role="alert"
       aria-live="assertive"
       [id]="errorId">
      {{ errorMessage }}
    </p>
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .ch-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .ch-input-element {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      color: var(--ch-text-muted);
      pointer-events: none;
      z-index: 1;
    }
    .ch-input-element--left  { left: 0; }
    .ch-input-element--right { right: 0; }

    .ch-input-addon {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      background: var(--ch-bg-subtle);
      border: 1px solid var(--ch-input-border);
      color: var(--ch-text-muted);
      white-space: nowrap;
    }
    .ch-input-addon--left  { border-right: none; border-radius: var(--ch-input-radius) 0 0 var(--ch-input-radius); }
    .ch-input-addon--right { border-left: none;  border-radius: 0 var(--ch-input-radius) var(--ch-input-radius) 0; }

    .ch-input-helper { font-size: var(--ch-text-sm); color: var(--ch-text-muted); margin-top: 0.25rem; }
    .ch-input-error  { font-size: var(--ch-text-sm); color: var(--ch-error);      margin-top: 0.25rem; }
  `],
})
export class ChInputComponent implements ControlValueAccessor {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() variant: InputVariant = 'outline';
  @Input() size: InputSize = 'md';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() type = 'text';
  @Input() id?: string;
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() ariaLabel?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() hasLeftAddon  = false;
  @Input() hasRightAddon = false;
  @Input() hasLeftElement  = false;
  @Input() hasRightElement = false;

  readonly valueChange = output<string>();

  readonly value   = signal('');
  readonly focused = signal(false);
  protected readonly errorId = `ch-input-error-${Math.random().toString(36).slice(2, 8)}`;

  private _disabled = false;
  private onChange:  (val: string) => void = () => {};
  private onTouched: () => void            = () => {};

  readonly isDisabled = computed(() => this._disabled || this.disabled);

  readonly inputClass = computed(() =>
    inputVariants({ variant: this.variant, size: this.size })
  );

  // ── ControlValueAccessor ──────────────────────────────────────────────

  writeValue(val: string | null): void      { this.value.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void   { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

  // ── Events ────────────────────────────────────────────────────────────

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void { this.focused.set(true); }
  onBlur():  void { this.focused.set(false); this.onTouched(); }

  /** Programmatic focus */
  focus(): void { this.inputEl?.nativeElement.focus(); }
  blur():  void { this.inputEl?.nativeElement.blur(); }
}
