import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, forwardRef, HostListener,
  ElementRef, ViewChild, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SliderSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ch-slider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChSliderComponent),
    multi:       true,
  }],
  template: `
    <div
      class="ch-slider"
      [class]="hostClasses()"
      [attr.aria-disabled]="disabled || null"
    >
      @if (label) {
        <div class="ch-slider__header">
          <label class="ch-slider__label" [attr.for]="sliderId">{{ label }}</label>
          @if (showValue) {
            <span class="ch-slider__value">{{ displayValue() }}</span>
          }
        </div>
      }

      <div class="ch-slider__track-wrapper">
        <!-- Helper text marks -->
        @if (showMarks) {
          <div class="ch-slider__marks">
            @for (mark of marks(); track mark.value) {
              <span
                class="ch-slider__mark"
                [style.left.%]="mark.pct"
                [class.ch-slider__mark--active]="currentValue() >= mark.value"
              >
                @if (mark.label) {
                  <span class="ch-slider__mark-label">{{ mark.label }}</span>
                }
              </span>
            }
          </div>
        }

        <!-- Track -->
        <div
          class="ch-slider__track"
          #trackEl
          (click)="onTrackClick($event)"
        >
          <div
            class="ch-slider__fill"
            [style.width.%]="fillPct()"
          ></div>

          <!-- Thumb -->
          <div
            class="ch-slider__thumb"
            [style.left.%]="fillPct()"
            [attr.role]="'slider'"
            [attr.aria-valuenow]="currentValue()"
            [attr.aria-valuemin]="min"
            [attr.aria-valuemax]="max"
            [attr.aria-label]="label || 'Slider'"
            [attr.aria-disabled]="disabled || null"
            [attr.tabindex]="disabled ? -1 : 0"
            (mousedown)="onThumbMouseDown($event)"
            (keydown)="onKeyDown($event)"
          >
            @if (showTooltip) {
              <div class="ch-slider__tooltip">{{ displayValue() }}</div>
            }
          </div>
        </div>

        <!-- Native input (for form compat) -->
        <input
          type="range"
          class="ch-slider__native"
          [id]="sliderId"
          [min]="min"
          [max]="max"
          [step]="step"
          [disabled]="disabled"
          [value]="currentValue()"
          (input)="onNativeInput($event)"
          aria-hidden="true"
          tabindex="-1"
        />
      </div>

      @if (helperText || errorMessage) {
        <p class="ch-slider__helper" [class.ch-slider__helper--error]="errorMessage">
          {{ errorMessage || helperText }}
        </p>
      }

      @if (showMinMax) {
        <div class="ch-slider__minmax">
          <span>{{ formatValue(min) }}</span>
          <span>{{ formatValue(max) }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-slider {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .ch-slider__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ch-slider__label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--ch-text, #1a202c);
    }
    .ch-slider__value {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ch-primary, #4f46e5);
    }

    .ch-slider__track-wrapper {
      position: relative;
      padding: 0.5rem 0;
    }

    .ch-slider__track {
      position: relative;
      width: 100%;
      border-radius: 9999px;
      background: var(--ch-border, #e2e8f0);
      cursor: pointer;
    }

    /* Size variants */
    .ch-slider--sm .ch-slider__track { height: 4px; }
    .ch-slider--md .ch-slider__track { height: 6px; }
    .ch-slider--lg .ch-slider__track { height: 8px; }

    .ch-slider__fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border-radius: 9999px;
      background: var(--ch-primary, #4f46e5);
      transition: width 0.05s;
    }

    .ch-slider__thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: white;
      border: 2px solid var(--ch-primary, #4f46e5);
      box-shadow: var(--ch-shadow-sm, 0 1px 3px rgba(0,0,0,0.12));
      cursor: grab;
      transition: box-shadow 0.15s, transform 0.1s;
      outline: none;
    }
    .ch-slider__thumb:active { cursor: grabbing; }

    /* Thumb sizes */
    .ch-slider--sm .ch-slider__thumb { width: 14px; height: 14px; }
    .ch-slider--md .ch-slider__thumb { width: 18px; height: 18px; }
    .ch-slider--lg .ch-slider__thumb { width: 22px; height: 22px; }

    .ch-slider__thumb:focus-visible {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-primary, #4f46e5) 30%, transparent);
    }
    .ch-slider__thumb:hover {
      box-shadow: 0 0 0 6px color-mix(in srgb, var(--ch-primary, #4f46e5) 15%, transparent);
    }

    /* Tooltip */
    .ch-slider__tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--ch-text, #1a202c);
      color: white;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: var(--ch-radius-sm, 4px);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .ch-slider__thumb:hover .ch-slider__tooltip,
    .ch-slider__thumb:focus-visible .ch-slider__tooltip { opacity: 1; }

    /* Native input hidden but accessible */
    .ch-slider__native {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }

    /* Marks */
    .ch-slider__marks {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .ch-slider__mark {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ch-border-strong, #cbd5e0);
    }
    .ch-slider__mark--active { background: var(--ch-primary, #4f46e5); }
    .ch-slider__mark-label {
      display: block;
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.6875rem;
      color: var(--ch-text-muted, #a0aec0);
      white-space: nowrap;
    }

    /* Min/max */
    .ch-slider__minmax {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--ch-text-muted, #a0aec0);
    }

    /* Helper */
    .ch-slider__helper {
      font-size: 0.75rem;
      color: var(--ch-text-muted, #a0aec0);
      margin: 0;
    }
    .ch-slider__helper--error { color: var(--ch-error, #e53e3e); }

    /* Disabled */
    .ch-slider--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    .ch-slider--disabled .ch-slider__thumb { cursor: not-allowed; }
  `],
})
export class ChSliderComponent implements OnChanges, ControlValueAccessor {

  @ViewChild('trackEl') trackEl!: ElementRef<HTMLElement>;

  @Input() min          = 0;
  @Input() max          = 100;
  @Input() step         = 1;
  @Input() size: SliderSize = 'md';
  @Input() label?:      string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() disabled     = false;
  @Input() showValue    = true;
  @Input() showTooltip  = false;
  @Input() showMinMax   = false;
  @Input() showMarks    = false;
  @Input() markStep?:   number;  // auto-generate marks every N steps
  @Input() prefix       = '';
  @Input() suffix       = '';
  @Input() sliderId     = `ch-slider-${Math.random().toString(36).slice(2, 7)}`;

  @Output() valueChange = new EventEmitter<number>();

  readonly currentValue = signal<number>(0);

  private _isDragging = false;
  private _onChange   = (_: number) => {};
  private _onTouched  = () => {};

  readonly fillPct = computed(() =>
    ((this.currentValue() - this.min) / (this.max - this.min)) * 100
  );

  readonly displayValue = computed(() =>
    `${this.prefix}${this.formatValue(this.currentValue())}${this.suffix}`
  );

  readonly hostClasses = computed(() => {
    const cls = [`ch-slider--${this.size}`];
    if (this.disabled) cls.push('ch-slider--disabled');
    return cls.join(' ');
  });

  readonly marks = computed(() => {
    const step = this.markStep ?? Math.ceil((this.max - this.min) / 10);
    const result: { value: number; pct: number; label?: string }[] = [];
    for (let v = this.min; v <= this.max; v += step) {
      result.push({
        value: v,
        pct:   ((v - this.min) / (this.max - this.min)) * 100,
      });
    }
    return result;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max']) {
      const clamped = this.clamp(this.currentValue());
      if (clamped !== this.currentValue()) this.currentValue.set(clamped);
    }
  }

  writeValue(val: number): void {
    if (val != null) this.currentValue.set(this.clamp(val));
  }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void          { this._onTouched = fn; }
  setDisabledState(d: boolean): void               { this.disabled = d; }

  onNativeInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.setValue(val);
  }

  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;
    const val = this.valueFromMouseEvent(event);
    this.setValue(val);
  }

  onThumbMouseDown(event: MouseEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    this._isDragging = true;

    const onMove = (e: MouseEvent) => {
      if (!this._isDragging) return;
      this.setValue(this.valueFromMouseEvent(e));
    };
    const onUp = () => {
      this._isDragging = false;
      this._onTouched();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;
    let delta = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') delta = this.step;
    if (event.key === 'ArrowLeft'  || event.key === 'ArrowDown') delta = -this.step;
    if (event.key === 'Home') { this.setValue(this.min); return; }
    if (event.key === 'End')  { this.setValue(this.max); return; }
    if (delta !== 0) {
      event.preventDefault();
      this.setValue(this.currentValue() + delta);
    }
  }

  private setValue(raw: number): void {
    const snapped = this.snap(raw);
    const clamped = this.clamp(snapped);
    this.currentValue.set(clamped);
    this._onChange(clamped);
    this.valueChange.emit(clamped);
  }

  private valueFromMouseEvent(event: MouseEvent): number {
    const el   = this.trackEl?.nativeElement;
    if (!el) return this.currentValue();
    const rect = el.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    return this.min + pct * (this.max - this.min);
  }

  private snap(val: number): number {
    return Math.round(val / this.step) * this.step;
  }

  private clamp(val: number): number {
    return Math.max(this.min, Math.min(this.max, val));
  }

  formatValue(val: number): string {
    return Number.isInteger(this.step) ? String(Math.round(val)) : val.toFixed(2);
  }
}
