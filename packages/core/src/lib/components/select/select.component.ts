import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { ChameleonSize } from '../../tokens/design-tokens.interface';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'ch-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChSelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ch-select-wrapper" [class]="wrapperClass()">
      <!-- Label -->
      <label *ngIf="label" class="ch-select__label" [attr.for]="inputId">{{ label }}</label>

      <div class="ch-select__control" [class]="controlClass()">
        <select
          class="ch-select__native"
          [id]="inputId"
          [disabled]="disabled()"
          [value]="value()"
          (change)="onNativeChange($event)"
          (focus)="focused.set(true)"
          (blur)="focused.set(false); _onTouched()">
          <option *ngIf="placeholder" value="" disabled [selected]="!value()">{{ placeholder }}</option>
          <ng-container *ngFor="let opt of options">
            <option [value]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
          </ng-container>
        </select>

        <!-- Chevron icon -->
        <span class="ch-select__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>

      <p *ngIf="invalid && errorMessage" class="ch-select__error" role="alert">{{ errorMessage }}</p>
      <p *ngIf="!invalid && helperText" class="ch-select__helper">{{ helperText }}</p>
    </div>
  `,
  styles: [`
    .ch-select-wrapper { display: flex; flex-direction: column; gap: 4px; width: 100%; }

    .ch-select__label {
      font-size: var(--ch-text-sm);
      font-weight: var(--ch-weight-medium);
      color: var(--ch-text);
      margin-bottom: 2px;
    }

    .ch-select__control {
      position: relative;
      display: flex;
      align-items: center;
    }

    .ch-select__native {
      width: 100%;
      appearance: none;
      padding: 0 2.5rem 0 var(--ch-space-3);
      height: var(--ch-input-height-md, 2.5rem);
      font-family: inherit;
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      background: var(--ch-input-bg, var(--ch-bg));
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-input-radius, var(--ch-radius-md));
      cursor: pointer;
      transition: all var(--ch-transition-fast);

      &:focus {
        outline: none;
        border-color: var(--ch-primary);
        box-shadow: 0 0 0 3px var(--ch-primary-subtle);
      }

      &:disabled { opacity: 0.5; cursor: not-allowed; }

      .ch-select__control--invalid & {
        border-color: var(--ch-error);
      }

      .ch-select__control--sm & { height: var(--ch-input-height-sm, 2rem); font-size: var(--ch-text-xs); }
      .ch-select__control--lg & { height: var(--ch-input-height-lg, 3rem); font-size: var(--ch-text-md); }

      .ch-select__control--filled & {
        background: var(--ch-bg-subtle);
        border-color: transparent;
        border-bottom-color: var(--ch-border);
        border-radius: var(--ch-radius-md) var(--ch-radius-md) 0 0;
      }

      .ch-select__control--flushed & {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid var(--ch-border);
        padding-left: 0;
      }
    }

    .ch-select__icon {
      position: absolute;
      right: var(--ch-space-3);
      pointer-events: none;
      color: var(--ch-text-muted);
      display: flex;
      align-items: center;
      svg { width: 1rem; height: 1rem; }
    }

    .ch-select__error  { font-size: var(--ch-text-xs); color: var(--ch-error); margin: 0; }
    .ch-select__helper { font-size: var(--ch-text-xs); color: var(--ch-text-muted); margin: 0; }
  `],
})
export class ChSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder?: string;
  @Input() label?: string;
  @Input() size: ChameleonSize = 'md';
  @Input() variant: 'outline' | 'filled' | 'flushed' = 'outline';
  @Input() invalid = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;

  @Output() selectionChange = new EventEmitter<any>();

  readonly inputId = `ch-select-${Math.random().toString(36).slice(2, 8)}`;

  readonly value    = signal<any>('');
  readonly focused  = signal(false);
  readonly disabled = signal(false);

  readonly wrapperClass = computed(() => '');

  readonly controlClass = computed(() => {
    const cls = [];
    if (this.size !== 'md')          cls.push(`ch-select__control--${this.size}`);
    if (this.variant !== 'outline')  cls.push(`ch-select__control--${this.variant}`);
    if (this.invalid)                cls.push('ch-select__control--invalid');
    return cls.join(' ');
  });

  _onChange: (v: any) => void = () => {};
  _onTouched: () => void = () => {};

  onNativeChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.value.set(val);
    this._onChange(val);
    this.selectionChange.emit(val);
  }

  writeValue(v: any): void        { this.value.set(v ?? ''); }
  registerOnChange(fn: any): void  { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled.set(d); }
}
