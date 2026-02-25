import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export type SegmentedOption =
  | string
  | { label: string; value: string; icon?: string; disabled?: boolean };

function normalizeOption(
  opt: SegmentedOption,
): { label: string; value: string; icon?: string; disabled: boolean } {
  if (typeof opt === 'string') {
    return { label: opt, value: opt, disabled: false };
  }
  return { ...opt, disabled: !!opt.disabled };
}

@Component({
  selector: 'ch-segmented',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedComponent),
      multi: true,
    },
  ],
  template: `
    <div
      #container
      class="ch-segmented"
      [class.ch-segmented--block]="block"
      [class.ch-segmented--disabled]="disabled"
      [class.ch-segmented--sm]="size === 'sm'"
      [class.ch-segmented--md]="size === 'md'"
      [class.ch-segmented--lg]="size === 'lg'"
      role="radiogroup"
    >
      <!-- Sliding indicator -->
      <div
        class="ch-segmented__indicator"
        [style.transform]="indicatorTransform()"
        [style.width.px]="indicatorWidth()"
        [style.height]="'calc(100% - 8px)'"
        [class.ch-segmented__indicator--hidden]="activeIndex() === -1"
      ></div>

      @for (opt of normalizedOptions(); track opt.value) {
        <button
          type="button"
          class="ch-segmented__item"
          [class.ch-segmented__item--active]="opt.value === selectedValue()"
          [disabled]="disabled || opt.disabled"
          [attr.aria-checked]="opt.value === selectedValue()"
          role="radio"
          (click)="select(opt.value)"
        >
          @if (opt.icon) {
            <span class="ch-segmented__icon" [innerHTML]="opt.icon"></span>
          }
          <span class="ch-segmented__label">{{ opt.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    /* Container */
    .ch-segmented {
      display: inline-flex;
      position: relative;
      align-items: center;
      padding: 4px;
      background: var(--ch-bg-subtle, #f5f5f5);
      border: 1px solid var(--ch-border, #e0e0e0);
      border-radius: var(--ch-radius-md, 8px);
      box-sizing: border-box;
      gap: 2px;
    }

    /* Block modifier */
    .ch-segmented--block {
      display: flex;
      width: 100%;
    }

    .ch-segmented--block .ch-segmented__item {
      flex: 1;
    }

    /* Disabled container */
    .ch-segmented--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Sliding indicator */
    .ch-segmented__indicator {
      position: absolute;
      top: 4px;
      left: 4px;
      background: var(--ch-bg, #ffffff);
      border-radius: var(--ch-radius-sm, 6px);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06),
                  0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: transform var(--ch-transition-duration, 200ms) var(--ch-transition-easing, ease),
                  width var(--ch-transition-duration, 200ms) var(--ch-transition-easing, ease);
      pointer-events: none;
      z-index: 0;
    }

    .ch-segmented__indicator--hidden {
      opacity: 0;
    }

    /* Option item (button) */
    .ch-segmented__item {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: none;
      background: transparent;
      color: var(--ch-text, #374151);
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      font-size: inherit;
      border-radius: var(--ch-radius-sm, 6px);
      transition: color var(--ch-transition-duration, 200ms) var(--ch-transition-easing, ease),
                  font-weight var(--ch-transition-duration, 200ms) var(--ch-transition-easing, ease);
      outline: none;
      user-select: none;
      line-height: 1.5;
    }

    /* Size: sm */
    .ch-segmented--sm .ch-segmented__item {
      padding: 2px 10px;
      font-size: var(--ch-font-size-sm, 12px);
    }

    /* Size: md (default) */
    .ch-segmented--md .ch-segmented__item {
      padding: 4px 14px;
      font-size: var(--ch-font-size-md, 14px);
    }

    /* Size: lg */
    .ch-segmented--lg .ch-segmented__item {
      padding: 6px 18px;
      font-size: var(--ch-font-size-lg, 16px);
    }

    /* Active */
    .ch-segmented__item--active {
      font-weight: var(--ch-font-weight-medium, 500);
      color: var(--ch-text, #374151);
    }

    /* Hover (non-active, non-disabled) */
    .ch-segmented__item:not(.ch-segmented__item--active):not(:disabled):hover {
      color: var(--ch-primary, #1677ff);
    }

    /* Focus-visible */
    .ch-segmented__item:focus-visible {
      outline: 2px solid var(--ch-primary, #1677ff);
      outline-offset: -2px;
    }

    /* Disabled item */
    .ch-segmented__item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Icon */
    .ch-segmented__icon {
      display: inline-flex;
      align-items: center;
      font-size: 1em;
    }

    /* Label */
    .ch-segmented__label {
      display: inline-block;
    }
  `],
})
export class SegmentedComponent
  implements ControlValueAccessor, AfterViewInit, OnChanges
{
  /* Inputs */
  @Input() options: SegmentedOption[] = [];
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() block = false;
  @Input() disabled = false;

  /* Outputs */
  @Output() valueChange = new EventEmitter<string>();

  /* View refs */
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLElement>;

  /* Signals */
  readonly selectedValue = signal<string>('');
  readonly normalizedOptions = signal<
    { label: string; value: string; icon?: string; disabled: boolean }[]
  >([]);

  readonly activeIndex = computed(() => {
    const val = this.selectedValue();
    return this.normalizedOptions().findIndex((o) => o.value === val);
  });

  readonly indicatorWidth = signal<number>(0);
  readonly indicatorTransform = signal<string>('translateX(0px)');

  /* CVA callbacks */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /* Lifecycle */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.normalizedOptions.set(
        (this.options ?? []).map(normalizeOption),
      );
      // Recalculate indicator after options change
      requestAnimationFrame(() => this.updateIndicator());
    }
  }

  ngAfterViewInit(): void {
    this.updateIndicator();
  }

  /* Public API */
  select(value: string): void {
    if (this.disabled) return;

    const opt = this.normalizedOptions().find((o) => o.value === value);
    if (opt?.disabled) return;

    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);

    requestAnimationFrame(() => this.updateIndicator());
  }

  /* ControlValueAccessor */
  writeValue(value: string): void {
    this.selectedValue.set(value ?? '');
    requestAnimationFrame(() => this.updateIndicator());
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /* Indicator positioning */
  private updateIndicator(): void {
    const idx = this.activeIndex();
    if (idx === -1 || !this.containerRef) {
      this.indicatorWidth.set(0);
      return;
    }

    const container: HTMLElement = this.containerRef.nativeElement;
    const buttons = container.querySelectorAll<HTMLButtonElement>(
      '.ch-segmented__item',
    );
    const activeBtn = buttons[idx];

    if (!activeBtn) return;

    this.indicatorWidth.set(activeBtn.offsetWidth);
    this.indicatorTransform.set(
      'translateX(' + (activeBtn.offsetLeft - container.offsetLeft - 4) + 'px)',
    );
  }
}
