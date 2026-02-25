import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  effect,
  forwardRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type CalendarMode = 'month' | 'year';
export type CalendarSize = 'sm' | 'default';

export interface CalendarPanelChangeEvent {
  date: Date;
  mode: string;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'ch-calendar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="ch-calendar"
      [class.ch-calendar--sm]="size === 'sm'"
      [class.ch-calendar--disabled]="disabled"
    >
      <!-- Header -->
      <div class="ch-calendar__header">
        <button
          type="button"
          class="ch-calendar__nav-btn"
          [disabled]="disabled"
          (click)="navigatePrev()"
          aria-label="Previous month"
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
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <span
          class="ch-calendar__title"
          (click)="onTitleClick()"
        >
          {{ currentMonthLabel() }} {{ currentYear() }}
        </span>

        <button
          type="button"
          class="ch-calendar__nav-btn"
          [disabled]="disabled"
          (click)="navigateNext()"
          aria-label="Next month"
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
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Day-of-week headers -->
      <div class="ch-calendar__grid">
        <div
          *ngFor="let dayName of weekDayLabels()"
          class="ch-calendar__weekday"
        >
          {{ dayName }}
        </div>

        <!-- Day cells -->
        <button
          *ngFor="let day of days()"
          type="button"
          class="ch-calendar__day"
          [class.ch-calendar__day--outside]="!day.isCurrentMonth"
          [class.ch-calendar__day--today]="day.isToday"
          [class.ch-calendar__day--selected]="day.isSelected"
          [class.ch-calendar__day--disabled]="day.isDisabled"
          [disabled]="day.isDisabled || disabled"
          (click)="selectDate(day)"
        >
          {{ day.day }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .ch-calendar {
        --_ch-calendar-cell-size: 36px;
        --_ch-calendar-font-size: 0.875rem;
        display: inline-block;
        font-family: var(--ch-font-family, inherit);
        user-select: none;
      }

      .ch-calendar--sm {
        --_ch-calendar-cell-size: 28px;
        --_ch-calendar-font-size: 0.75rem;
      }

      .ch-calendar--disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      /* ---- Header ---- */
      .ch-calendar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 8px 0;
      }

      .ch-calendar__title {
        font-weight: 600;
        font-size: var(--_ch-calendar-font-size);
        color: var(--ch-text, #1a1a1a);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: var(--ch-radius, 4px);
        transition: background-color 0.15s ease;
      }

      .ch-calendar__title:hover {
        background-color: var(--ch-bg-subtle, #f5f5f5);
      }

      .ch-calendar__nav-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--_ch-calendar-cell-size);
        height: var(--_ch-calendar-cell-size);
        padding: 0;
        border: none;
        border-radius: var(--ch-radius, 4px);
        background: transparent;
        color: var(--ch-text, #1a1a1a);
        cursor: pointer;
        transition: background-color 0.15s ease;
      }

      .ch-calendar__nav-btn:hover:not(:disabled) {
        background-color: var(--ch-bg-subtle, #f5f5f5);
      }

      .ch-calendar__nav-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }

      /* ---- Grid ---- */
      .ch-calendar__grid {
        display: grid;
        grid-template-columns: repeat(7, var(--_ch-calendar-cell-size));
        gap: 1px;
      }

      .ch-calendar__weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--_ch-calendar-cell-size);
        height: var(--_ch-calendar-cell-size);
        font-size: calc(var(--_ch-calendar-font-size) - 0.0625rem);
        font-weight: 600;
        color: var(--ch-text-secondary, #6b7280);
      }

      /* ---- Day cells ---- */
      .ch-calendar__day {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--_ch-calendar-cell-size);
        height: var(--_ch-calendar-cell-size);
        padding: 0;
        border: 1px solid transparent;
        border-radius: var(--ch-radius, 4px);
        background: transparent;
        color: var(--ch-text, #1a1a1a);
        font-size: var(--_ch-calendar-font-size);
        cursor: pointer;
        transition:
          background-color 0.15s ease,
          border-color 0.15s ease,
          color 0.15s ease;
      }

      .ch-calendar__day:hover:not(:disabled):not(.ch-calendar__day--selected) {
        background-color: var(--ch-bg-subtle, #f5f5f5);
      }

      .ch-calendar__day--outside {
        color: var(--ch-text-disabled, #d1d5db);
      }

      .ch-calendar__day--today:not(.ch-calendar__day--selected) {
        border: 1px solid var(--ch-primary, #3b82f6);
      }

      .ch-calendar__day--selected {
        background-color: var(--ch-primary, #3b82f6);
        color: #fff;
        font-weight: 600;
      }

      .ch-calendar__day--selected:hover {
        background-color: var(--ch-primary, #3b82f6);
      }

      .ch-calendar__day--disabled {
        color: var(--ch-text-disabled, #d1d5db);
        cursor: default;
      }
    `,
  ],
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  // --------------- Inputs ---------------
  @Input() mode: CalendarMode = 'month';
  @Input() size: CalendarSize = 'default';
  @Input() disabled = false;
  @Input() locale = 'en-US';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;

  // --------------- Outputs ---------------
  @Output() valueChange = new EventEmitter<Date>();
  @Output() panelChange = new EventEmitter<CalendarPanelChangeEvent>();

  // --------------- Signals ---------------
  /** The currently viewed month (0-11). */
  viewMonth = signal<number>(new Date().getMonth());

  /** The currently viewed year. */
  viewYear = signal<number>(new Date().getFullYear());

  /** The currently selected date (null when nothing is selected). */
  selectedDate = signal<Date | null>(null);

  // --------------- Computed ---------------
  currentYear = computed(() => this.viewYear());

  currentMonthLabel = computed(() => {
    const date = new Date(this.viewYear(), this.viewMonth(), 1);
    return date.toLocaleString(this.locale, { month: 'long' });
  });

  weekDayLabels = computed(() => {
    const labels: string[] = [];
    // Start from Monday (day index 1)
    for (let i = 1; i <= 7; i++) {
      // 2024-01-01 is a Monday
      const d = new Date(2024, 0, i);
      labels.push(d.toLocaleString(this.locale, { weekday: 'short' }));
    }
    return labels;
  });

  days = computed<CalendarDay[]>(() => this.generateDays());

  // --------------- CVA ---------------
  private onChange: (value: Date) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Whenever selectedDate changes, propagate to form control
    effect(() => {
      const date = this.selectedDate();
      if (date) {
        this.onChange(date);
      }
    });
  }

  ngOnInit(): void {
    // Ensure the view month/year is initialised from the selected value if any
    const sel = this.selectedDate();
    if (sel) {
      this.viewMonth.set(sel.getMonth());
      this.viewYear.set(sel.getFullYear());
    }
  }

  // --------------- ControlValueAccessor ---------------
  writeValue(value: Date | null): void {
    if (value instanceof Date && !isNaN(value.getTime())) {
      this.selectedDate.set(value);
      this.viewMonth.set(value.getMonth());
      this.viewYear.set(value.getFullYear());
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --------------- Navigation ---------------
  navigatePrev(): void {
    let month = this.viewMonth();
    let year = this.viewYear();
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    this.viewMonth.set(month);
    this.viewYear.set(year);
    this.panelChange.emit({
      date: new Date(year, month, 1),
      mode: this.mode,
    });
  }

  navigateNext(): void {
    let month = this.viewMonth();
    let year = this.viewYear();
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    this.viewMonth.set(month);
    this.viewYear.set(year);
    this.panelChange.emit({
      date: new Date(year, month, 1),
      mode: this.mode,
    });
  }

  onTitleClick(): void {
    const nextMode: CalendarMode = this.mode === 'month' ? 'year' : 'month';
    this.panelChange.emit({
      date: new Date(this.viewYear(), this.viewMonth(), 1),
      mode: nextMode,
    });
  }

  // --------------- Selection ---------------
  selectDate(day: CalendarDay): void {
    if (day.isDisabled || this.disabled) {
      return;
    }

    // If the day belongs to a different month, navigate to it
    if (!day.isCurrentMonth) {
      this.viewMonth.set(day.date.getMonth());
      this.viewYear.set(day.date.getFullYear());
    }

    this.selectedDate.set(day.date);
    this.valueChange.emit(day.date);
    this.onTouched();
  }

  // --------------- Grid generation ---------------
  /**
   * Generates a 42-cell (6 rows x 7 cols) grid of CalendarDay objects
   * starting from Monday of the week containing the 1st of the viewed month.
   */
  private generateDays(): CalendarDay[] {
    const year = this.viewYear();
    const month = this.viewMonth();
    const selected = this.selectedDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);

    // getDay() returns 0 = Sunday. Convert so Monday = 0.
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek < 0) {
      startDayOfWeek = 6; // Sunday wraps to index 6
    }

    // The grid starts this many days before the 1st
    const gridStart = new Date(year, month, 1 - startDayOfWeek);

    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i,
      );
      cellDate.setHours(0, 0, 0, 0);

      const isCurrentMonth = cellDate.getMonth() === month && cellDate.getFullYear() === year;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected =
        selected !== null &&
        cellDate.getFullYear() === selected.getFullYear() &&
        cellDate.getMonth() === selected.getMonth() &&
        cellDate.getDate() === selected.getDate();

      let isDisabled = false;
      if (this.minDate) {
        const min = new Date(this.minDate);
        min.setHours(0, 0, 0, 0);
        if (cellDate < min) {
          isDisabled = true;
        }
      }
      if (this.maxDate) {
        const max = new Date(this.maxDate);
        max.setHours(0, 0, 0, 0);
        if (cellDate > max) {
          isDisabled = true;
        }
      }

      days.push({
        date: cellDate,
        day: cellDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
      });
    }

    return days;
  }
}
