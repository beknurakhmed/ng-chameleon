import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, forwardRef, OnChanges,
  SimpleChanges, HostListener, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DatePickerMode = 'single' | 'range';

export interface DateRange {
  start: Date | null;
  end:   Date | null;
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}
function isBetween(d: Date, start: Date, end: Date): boolean {
  return d > start && d < end;
}

interface CalendarDay {
  date:         Date;
  dayNumber:    number;
  isCurrentMonth: boolean;
  isToday:      boolean;
  isDisabled:   boolean;
}

@Component({
  selector: 'ch-date-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChDatePickerComponent),
    multi:       true,
  }],
  template: `
    <div
      class="ch-datepicker"
      [class.ch-datepicker--open]="isOpen()"
      [class.ch-datepicker--disabled]="disabled"
    >
      <!-- Trigger input -->
      <div
        class="ch-datepicker__input"
        [class.ch-datepicker__input--focus]="isOpen()"
        [class.ch-datepicker__input--error]="!!errorMessage"
        (click)="toggleOpen()"
        (keydown.enter)="toggleOpen()"
        (keydown.space)="toggleOpen()"
        [attr.tabindex]="disabled ? -1 : 0"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'dialog'"
        [attr.aria-label]="placeholder"
        role="combobox"
      >
        @if (label) {
          <label class="ch-datepicker__label">{{ label }}</label>
        }
        <span class="ch-datepicker__display" [class.ch-datepicker__display--placeholder]="!displayText()">
          {{ displayText() || placeholder }}
        </span>
        <svg class="ch-datepicker__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="3" width="12" height="12" rx="1.5"/>
          <path d="M5 1v4M11 1v4M2 7h12"/>
        </svg>
      </div>

      @if (errorMessage) {
        <p class="ch-datepicker__error">{{ errorMessage }}</p>
      } @else if (helperText) {
        <p class="ch-datepicker__helper">{{ helperText }}</p>
      }

      <!-- Calendar panel -->
      @if (isOpen()) {
        <div
          class="ch-datepicker__panel"
          role="dialog"
          [attr.aria-label]="'Calendar'"
        >
          <!-- Header: month/year navigation -->
          <div class="ch-datepicker__header">
            <button
              type="button"
              class="ch-datepicker__nav"
              aria-label="Previous year"
              (click)="prevYear()"
            >&laquo;</button>
            <button
              type="button"
              class="ch-datepicker__nav"
              aria-label="Previous month"
              (click)="prevMonth()"
            >&lsaquo;</button>

            <span class="ch-datepicker__title">
              {{ MONTHS[viewMonth()] }} {{ viewYear() }}
            </span>

            <button
              type="button"
              class="ch-datepicker__nav"
              aria-label="Next month"
              (click)="nextMonth()"
            >&rsaquo;</button>
            <button
              type="button"
              class="ch-datepicker__nav"
              aria-label="Next year"
              (click)="nextYear()"
            >&raquo;</button>
          </div>

          <!-- Day names -->
          <div class="ch-datepicker__weekdays">
            @for (d of DAYS; track d) {
              <span class="ch-datepicker__weekday">{{ d }}</span>
            }
          </div>

          <!-- Days grid -->
          <div class="ch-datepicker__grid">
            @for (day of calendarDays(); track day.date.toISOString()) {
              <button
                type="button"
                class="ch-datepicker__day"
                [class.ch-datepicker__day--other-month]="!day.isCurrentMonth"
                [class.ch-datepicker__day--today]="day.isToday"
                [class.ch-datepicker__day--selected]="isSelected(day.date)"
                [class.ch-datepicker__day--range-start]="isRangeStart(day.date)"
                [class.ch-datepicker__day--range-end]="isRangeEnd(day.date)"
                [class.ch-datepicker__day--in-range]="isInRange(day.date)"
                [disabled]="day.isDisabled"
                [attr.aria-label]="day.date.toDateString()"
                [attr.aria-selected]="isSelected(day.date)"
                (click)="onDayClick(day.date)"
                (mouseenter)="onDayHover(day.date)"
              >
                {{ day.dayNumber }}
              </button>
            }
          </div>

          <!-- Footer: Today / Clear -->
          <div class="ch-datepicker__footer">
            <button type="button" class="ch-datepicker__footer-btn" (click)="selectToday()">Today</button>
            <button type="button" class="ch-datepicker__footer-btn ch-datepicker__footer-btn--muted" (click)="clearValue()">Clear</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-datepicker {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 220px;
    }

    /* Input trigger */
    .ch-datepicker__input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1.5px solid var(--ch-border, #e2e8f0);
      border-radius: var(--ch-radius-md, 0.5rem);
      background: var(--ch-bg, #fff);
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
      min-height: 40px;
      user-select: none;
    }
    .ch-datepicker__input:hover { border-color: var(--ch-border-strong, #a0aec0); }
    .ch-datepicker__input--focus {
      border-color: var(--ch-primary, #4f46e5);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-primary, #4f46e5) 20%, transparent);
    }
    .ch-datepicker__input--error { border-color: var(--ch-error, #e53e3e); }

    .ch-datepicker__label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ch-text-subtle, #4a5568);
      margin-bottom: 2px;
    }
    .ch-datepicker__display {
      flex: 1;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
    }
    .ch-datepicker__display--placeholder { color: var(--ch-text-muted, #a0aec0); }
    .ch-datepicker__icon { color: var(--ch-text-muted, #a0aec0); flex-shrink: 0; }

    .ch-datepicker__error  { font-size: 0.75rem; color: var(--ch-error, #e53e3e); margin: 0; }
    .ch-datepicker__helper { font-size: 0.75rem; color: var(--ch-text-muted, #a0aec0); margin: 0; }

    /* Panel */
    .ch-datepicker__panel {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 200;
      background: var(--ch-bg, #fff);
      border: 1.5px solid var(--ch-border, #e2e8f0);
      border-radius: var(--ch-radius-lg, 0.75rem);
      box-shadow: var(--ch-shadow-lg, 0 10px 40px rgba(0,0,0,0.15));
      padding: 0.75rem;
      width: 280px;
      animation: ch-dp-in 0.12s ease;
    }
    @keyframes ch-dp-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .ch-datepicker__header {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .ch-datepicker__title {
      flex: 1;
      text-align: center;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
    }
    .ch-datepicker__nav {
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      color: var(--ch-text-subtle, #4a5568);
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s;
    }
    .ch-datepicker__nav:hover { background: var(--ch-bg-subtle, #f7fafc); }

    /* Weekdays */
    .ch-datepicker__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 0.25rem;
    }
    .ch-datepicker__weekday {
      text-align: center;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--ch-text-muted, #a0aec0);
      padding: 0.25rem 0;
      text-transform: uppercase;
    }

    /* Grid */
    .ch-datepicker__grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
    }
    .ch-datepicker__day {
      width: 100%;
      aspect-ratio: 1;
      border: none;
      background: none;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--ch-text, #1a202c);
      transition: background 0.1s, color 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ch-datepicker__day:hover:not(:disabled) { background: var(--ch-bg-subtle, #f7fafc); }
    .ch-datepicker__day--other-month { color: var(--ch-text-muted, #a0aec0); }
    .ch-datepicker__day--today {
      font-weight: 700;
      color: var(--ch-primary, #4f46e5);
    }
    .ch-datepicker__day--selected,
    .ch-datepicker__day--range-start,
    .ch-datepicker__day--range-end {
      background: var(--ch-primary, #4f46e5) !important;
      color: white !important;
      font-weight: 600;
    }
    .ch-datepicker__day--in-range {
      background: color-mix(in srgb, var(--ch-primary, #4f46e5) 15%, transparent);
      border-radius: 0;
    }
    .ch-datepicker__day--range-start { border-radius: var(--ch-radius-sm, 4px) 0 0 var(--ch-radius-sm, 4px); }
    .ch-datepicker__day--range-end   { border-radius: 0 var(--ch-radius-sm, 4px) var(--ch-radius-sm, 4px) 0; }
    .ch-datepicker__day:disabled { opacity: 0.35; cursor: not-allowed; }

    /* Footer */
    .ch-datepicker__footer {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--ch-border, #e2e8f0);
    }
    .ch-datepicker__footer-btn {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border: none;
      background: none;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      color: var(--ch-primary, #4f46e5);
      transition: background 0.1s;
    }
    .ch-datepicker__footer-btn:hover { background: var(--ch-bg-subtle, #f7fafc); }
    .ch-datepicker__footer-btn--muted { color: var(--ch-text-muted, #a0aec0); }

    /* Disabled state */
    .ch-datepicker--disabled .ch-datepicker__input {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  `],
})
export class ChDatePickerComponent implements OnChanges, ControlValueAccessor {

  protected readonly DAYS   = DAYS;
  protected readonly MONTHS = MONTHS;

  @Input() mode:         DatePickerMode = 'single';
  @Input() placeholder   = 'Select date...';
  @Input() label?:       string;
  @Input() helperText?:  string;
  @Input() errorMessage?: string;
  @Input() disabled      = false;
  @Input() minDate?:     Date;
  @Input() maxDate?:     Date;
  @Input() disabledDates: Date[] = [];
  /** Pre-selected value. For single: Date; for range: DateRange */
  @Input() value:        Date | DateRange | null = null;

  @Output() dateChange  = new EventEmitter<Date | DateRange | null>();

  readonly isOpen     = signal(false);
  readonly viewMonth  = signal(new Date().getMonth());
  readonly viewYear   = signal(new Date().getFullYear());

  private _selected   = signal<Date | null>(null);
  private _rangeStart = signal<Date | null>(null);
  private _rangeEnd   = signal<Date | null>(null);
  private _hoverDate  = signal<Date | null>(null);

  private _onChange   = (_: Date | DateRange | null) => {};
  private _onTouched  = () => {};

  readonly displayText = computed<string>(() => {
    if (this.mode === 'range') {
      const s = this._rangeStart();
      const e = this._rangeEnd();
      if (!s) return '';
      if (!e) return this.fmt(s) + ' - ...';
      return this.fmt(s) + ' - ' + this.fmt(e);
    }
    const sel = this._selected();
    return sel ? this.fmt(sel) : '';
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const month = this.viewMonth();
    const year  = this.viewYear();
    const today = new Date();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    // Pad start
    for (let i = 0; i < first.getDay(); i++) {
      const d = new Date(year, month, -i);
      days.unshift({ date: d, dayNumber: d.getDate(), isCurrentMonth: false, isToday: false, isDisabled: true });
    }

    // Current month
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        dayNumber:      d,
        isCurrentMonth: true,
        isToday:        sameDay(date, today),
        isDisabled:     this.isDayDisabled(date),
      });
    }

    // Pad end to 42 cells (6 rows)
    while (days.length < 42) {
      const idx = days.length - (first.getDay() + last.getDate());
      const d   = new Date(year, month + 1, idx + 1);
      days.push({ date: d, dayNumber: d.getDate(), isCurrentMonth: false, isToday: false, isDisabled: true });
    }

    return days;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.setValueFromInput(this.value);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  constructor(private el: ElementRef) {}

  writeValue(val: Date | DateRange | null): void {
    if (val) this.setValueFromInput(val);
    else this.clearValue();
  }
  registerOnChange(fn: (v: Date | DateRange | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void                          { this._onTouched = fn; }
  setDisabledState(d: boolean): void                               { this.disabled = d; }

  toggleOpen(): void {
    if (this.disabled) return;
    this.isOpen.update(v => !v);
    if (this.isOpen()) this._onTouched();
  }

  onDayClick(date: Date): void {
    if (this.mode === 'single') {
      this._selected.set(date);
      const val = new Date(date);
      this._onChange(val);
      this.dateChange.emit(val);
      this.isOpen.set(false);
    } else {
      const s = this._rangeStart();
      if (!s || (s && this._rangeEnd())) {
        // Start new range
        this._rangeStart.set(date);
        this._rangeEnd.set(null);
      } else {
        // End range
        if (date < s) {
          this._rangeEnd.set(s);
          this._rangeStart.set(date);
        } else {
          this._rangeEnd.set(date);
        }
        const range: DateRange = { start: this._rangeStart(), end: this._rangeEnd() };
        this._onChange(range);
        this.dateChange.emit(range);
        this.isOpen.set(false);
      }
    }
  }

  onDayHover(date: Date): void {
    if (this.mode === 'range') this._hoverDate.set(date);
  }

  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update(y => y - 1);
    } else {
      this.viewMonth.update(m => m - 1);
    }
  }
  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update(y => y + 1);
    } else {
      this.viewMonth.update(m => m + 1);
    }
  }
  prevYear(): void { this.viewYear.update(y => y - 1); }
  nextYear(): void { this.viewYear.update(y => y + 1); }

  selectToday(): void { this.onDayClick(new Date()); }

  clearValue(): void {
    this._selected.set(null);
    this._rangeStart.set(null);
    this._rangeEnd.set(null);
    this._onChange(null);
    this.dateChange.emit(null);
  }

  isSelected(date: Date): boolean {
    if (this.mode === 'single') {
      const s = this._selected();
      return !!s && sameDay(date, s);
    }
    return false;
  }

  isRangeStart(date: Date): boolean {
    const s = this._rangeStart();
    return this.mode === 'range' && !!s && sameDay(date, s);
  }

  isRangeEnd(date: Date): boolean {
    const e = this._rangeEnd();
    return this.mode === 'range' && !!e && sameDay(date, e);
  }

  isInRange(date: Date): boolean {
    if (this.mode !== 'range') return false;
    const s = this._rangeStart();
    const e = this._rangeEnd() ?? this._hoverDate();
    if (!s || !e) return false;
    const start = s < e ? s : e;
    const end   = s < e ? e : s;
    return isBetween(date, start, end);
  }

  private isDayDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return this.disabledDates.some(d => sameDay(d, date));
  }

  private fmt(d: Date): string {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private setValueFromInput(val: Date | DateRange): void {
    if (val instanceof Date) {
      this._selected.set(val);
      this.viewMonth.set(val.getMonth());
      this.viewYear.set(val.getFullYear());
    } else {
      this._rangeStart.set(val.start);
      this._rangeEnd.set(val.end);
      if (val.start) {
        this.viewMonth.set(val.start.getMonth());
        this.viewYear.set(val.start.getFullYear());
      }
    }
  }
}
