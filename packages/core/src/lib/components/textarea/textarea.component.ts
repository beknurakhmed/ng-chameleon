import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { ChameleonSize } from '../../tokens/design-tokens.interface';

export type TextareaVariant  = 'outline' | 'filled' | 'flushed' | 'unstyled';
export type TextareaResize   = 'none' | 'vertical' | 'horizontal' | 'both';

@Component({
  selector: 'ch-textarea',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChTextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ch-textarea-wrapper" [class]="wrapperClass()">
      <textarea
        class="ch-textarea"
        [class]="textareaClass()"
        [rows]="rows"
        [placeholder]="placeholder"
        [disabled]="disabled()"
        [attr.maxlength]="maxLength || null"
        [value]="value()"
        (input)="onInput($event)"
        (focus)="focused.set(true)"
        (blur)="focused.set(false); _onTouched()">
      </textarea>

      <div *ngIf="maxLength" class="ch-textarea__counter">
        {{ value().length }} / {{ maxLength }}
      </div>

      <p *ngIf="invalid && errorMessage" class="ch-textarea__error" role="alert">
        {{ errorMessage }}
      </p>
      <p *ngIf="!invalid && helperText" class="ch-textarea__helper">
        {{ helperText }}
      </p>
    </div>
  `,
  styles: [`
    .ch-textarea-wrapper { display: flex; flex-direction: column; gap: 4px; width: 100%; }

    .ch-textarea {
      width: 100%;
      padding: var(--ch-space-2) var(--ch-space-3);
      font-family: inherit;
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      background: var(--ch-input-bg, var(--ch-bg));
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-input-radius, var(--ch-radius-md));
      transition: all var(--ch-transition-fast);
      resize: vertical;
      min-height: 80px;
      line-height: var(--ch-leading-normal);

      &::placeholder { color: var(--ch-text-placeholder, var(--ch-text-muted)); }

      &:focus {
        outline: none;
        border-color: var(--ch-primary);
        box-shadow: 0 0 0 3px var(--ch-primary-subtle);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &--invalid {
        border-color: var(--ch-error);
        &:focus { box-shadow: 0 0 0 3px var(--ch-error-subtle, rgba(239,68,68,0.12)); }
      }

      &--filled {
        background: var(--ch-bg-subtle);
        border-color: transparent;
        border-bottom-color: var(--ch-border);
        border-radius: var(--ch-radius-md) var(--ch-radius-md) 0 0;
        &:focus { background: var(--ch-bg-subtle); }
      }

      &--flushed {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid var(--ch-border);
        padding-left: 0;
        &:focus { box-shadow: 0 1px 0 0 var(--ch-primary); }
      }

      &--unstyled {
        border: none;
        background: transparent;
        padding: 0;
        &:focus { box-shadow: none; }
      }

      &--resize-none       { resize: none; }
      &--resize-horizontal { resize: horizontal; }
      &--resize-both       { resize: both; }
    }

    .ch-textarea__counter {
      align-self: flex-end;
      font-size: var(--ch-text-xs);
      color: var(--ch-text-muted);
    }
    .ch-textarea__error  { font-size: var(--ch-text-xs); color: var(--ch-error); margin: 0; }
    .ch-textarea__helper { font-size: var(--ch-text-xs); color: var(--ch-text-muted); margin: 0; }
  `],
})
export class ChTextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() rows = 3;
  @Input() variant: TextareaVariant = 'outline';
  @Input() resize: TextareaResize = 'vertical';
  @Input() invalid = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() maxLength?: number;

  @Output() valueChange = new EventEmitter<string>();

  readonly value    = signal('');
  readonly focused  = signal(false);
  readonly disabled = signal(false);

  readonly wrapperClass = computed(() => {
    return this.focused() ? 'ch-textarea-wrapper--focused' : '';
  });

  readonly textareaClass = computed(() => {
    const cls = [];
    if (this.variant !== 'outline') cls.push(`ch-textarea--${this.variant}`);
    if (this.invalid)               cls.push('ch-textarea--invalid');
    if (this.resize !== 'vertical') cls.push(`ch-textarea--resize-${this.resize}`);
    return cls.join(' ');
  });

  _onChange: (v: string) => void = () => {};
  _onTouched: () => void = () => {};

  onInput(e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this._onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(v: string): void     { this.value.set(v ?? ''); }
  registerOnChange(fn: any): void  { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled.set(d); }
}
