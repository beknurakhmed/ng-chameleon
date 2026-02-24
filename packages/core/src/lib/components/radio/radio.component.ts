import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, signal, ViewEncapsulation, ContentChildren,
  QueryList, AfterContentInit, OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';
import { Subscription } from 'rxjs';

// ── Individual Radio ──────────────────────────────────────────────────────────
@Component({
  selector: 'ch-radio',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="ch-radio" [class.ch-radio--disabled]="disabled">
      <span class="ch-radio__control"
        [class.ch-radio__control--checked]="checked"
        role="radio"
        [attr.aria-checked]="checked"
        [attr.tabindex]="disabled ? -1 : 0"
        (click)="onSelect()"
        (keydown.space)="$event.preventDefault(); onSelect()">
        <input type="radio" class="ch-radio__input" [checked]="checked"
          [disabled]="disabled" [value]="value" aria-hidden="true">
        <span *ngIf="checked" class="ch-radio__dot"></span>
      </span>
      <span class="ch-radio__label">
        <ng-content></ng-content>
      </span>
    </label>
  `,
  styles: [`
    .ch-radio {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-2);
      cursor: pointer;
      user-select: none;
      &--disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .ch-radio__input {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }

    .ch-radio__control {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem; height: 1rem;
      border: 2px solid var(--ch-border-strong, var(--ch-border));
      border-radius: 50%;
      background: var(--ch-bg);
      transition: all var(--ch-transition-fast);
      flex-shrink: 0;

      &--checked {
        border-color: var(--ch-primary);
        background: var(--ch-bg);
      }

      &:focus-visible {
        outline: 2px solid var(--ch-primary);
        outline-offset: 2px;
      }
    }

    .ch-radio__dot {
      width: 0.45rem; height: 0.45rem;
      border-radius: 50%;
      background: var(--ch-primary);
    }

    .ch-radio__label {
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
    }
  `],
})
export class ChRadioComponent {
  @Input() value: any;
  @Input() disabled = false;

  checked = false;
  _onSelect?: () => void;

  onSelect(): void {
    if (this.disabled) return;
    this._onSelect?.();
  }
}

// ── Radio Group ───────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-radio-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChRadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ch-radio-group"
      [class]="'ch-radio-group--' + direction"
      role="radiogroup">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .ch-radio-group {
      display: flex;
      gap: var(--ch-space-3);
      &--column { flex-direction: column; }
      &--row    { flex-direction: row; flex-wrap: wrap; }
    }
  `],
})
export class ChRadioGroupComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @Input() direction: 'row' | 'column' = 'column';
  @Output() changed = new EventEmitter<any>();

  @ContentChildren(ChRadioComponent, { descendants: true })
  radios!: QueryList<ChRadioComponent>;

  private _value = signal<any>(null);
  private _disabled = signal(false);
  private _sub?: Subscription;

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  ngAfterContentInit(): void {
    this._initRadios();
    this._sub = this.radios.changes.subscribe(() => this._initRadios());
  }

  ngOnDestroy(): void { this._sub?.unsubscribe(); }

  private _initRadios(): void {
    this.radios.forEach(r => {
      r.checked = r.value === this._value();
      r._onSelect = () => this._select(r.value);
    });
  }

  private _select(value: any): void {
    this._value.set(value);
    this.radios.forEach(r => { r.checked = r.value === value; });
    this._onChange(value);
    this._onTouched();
    this.changed.emit(value);
  }

  writeValue(v: any): void {
    this._value.set(v);
    this.radios?.forEach(r => { r.checked = r.value === v; });
  }

  registerOnChange(fn: any): void  { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void {
    this._disabled.set(d);
    this.radios?.forEach(r => { r.disabled = d; });
  }
}
