import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';

@Component({
  selector: 'ch-switch',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChSwitchComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ch-switch" [class.ch-switch--disabled]="disabled">
      <button
        type="button"
        role="switch"
        class="ch-switch__track"
        [class]="trackClass()"
        [attr.aria-checked]="checked()"
        [attr.aria-disabled]="disabled || null"
        [attr.tabindex]="disabled ? -1 : 0"
        (click)="toggle()"
        (keydown.space)="$event.preventDefault(); toggle()">
        <span class="ch-switch__thumb" [class.ch-switch__thumb--on]="checked()"></span>
      </button>
      <span *ngIf="label" class="ch-switch__label">{{ label }}</span>
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    .ch-switch {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-2);
      cursor: pointer;
      user-select: none;
      &--disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .ch-switch__track {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      transition: background var(--ch-transition-fast);
      border-radius: var(--ch-radius-full);
      background: var(--ch-border-strong, var(--ch-border));

      /* sizes */
      &--sm { width: 1.75rem; height: 1rem; }
      &--md { width: 2.25rem; height: 1.25rem; }
      &--lg { width: 2.75rem; height: 1.5rem; }

      &--checked { background: var(--ch-primary); }

      &:focus-visible {
        outline: 2px solid var(--ch-primary);
        outline-offset: 2px;
      }

      .ch-switch--disabled & { cursor: not-allowed; }
    }

    .ch-switch__thumb {
      position: absolute;
      left: 2px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: transform var(--ch-transition-fast);

      .ch-switch__track--sm & { width: 0.75rem; height: 0.75rem; }
      .ch-switch__track--md & { width: 1rem; height: 1rem; }
      .ch-switch__track--lg & { width: 1.25rem; height: 1.25rem; }

      &--on {
        .ch-switch__track--sm & { transform: translateX(0.75rem); }
        .ch-switch__track--md & { transform: translateX(1rem); }
        .ch-switch__track--lg & { transform: translateX(1.25rem); }
      }
    }

    .ch-switch__label {
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
    }
  `],
})
export class ChSwitchComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() size: ChameleonSize = 'md';
  @Input() colorScheme: ChameleonColorScheme = 'primary';
  @Input() set disabled(v: boolean) { this._disabled.set(v); }
  get disabled() { return this._disabled(); }

  @Output() changed = new EventEmitter<boolean>();

  private _checked  = signal(false);
  private _disabled = signal(false);

  readonly checked = this._checked.asReadonly();

  readonly trackClass = computed(() => {
    const cls = [`ch-switch__track--${this.size}`];
    if (this._checked()) cls.push('ch-switch__track--checked');
    return cls.join(' ');
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
