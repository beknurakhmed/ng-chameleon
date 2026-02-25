import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  forwardRef,
  input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type RatingSize = 'sm' | 'md' | 'lg';

const RATING_SIZE_MAP: Record<RatingSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

@Component({
  selector: 'ch-rating',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
  styles: [
    `
      .ch-rating {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }

      .ch-rating__star {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 2px;
        margin: 0;
        cursor: pointer;
        outline: none;
        transition: transform 0.15s ease;
        color: var(--ch-rating-empty-color, #d1d5db);
      }

      .ch-rating__star:hover:not(:disabled) {
        transform: scale(1.15);
      }

      .ch-rating__star:focus-visible {
        border-radius: 2px;
        box-shadow: 0 0 0 2px var(--ch-warning, #f59e0b);
      }

      .ch-rating__star--filled,
      .ch-rating__star--half {
        color: var(--ch-warning, #f59e0b);
      }

      .ch-rating__star--preview {
        color: var(--ch-warning, #f59e0b);
        opacity: 0.7;
      }

      .ch-rating__star:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .ch-rating__star--readonly {
        cursor: default;
        pointer-events: none;
      }

      .ch-rating__star svg {
        display: block;
      }
    `,
  ],
  template: `
    <div
      class="ch-rating"
      role="radiogroup"
      aria-label="Rating"
      (mouseleave)="onMouseLeave()"
    >
      @for (star of stars(); track star.index) {
        <button
          type="button"
          class="ch-rating__star"
          [class.ch-rating__star--filled]="star.state === 'filled'"
          [class.ch-rating__star--half]="star.state === 'half'"
          [class.ch-rating__star--preview]="star.preview"
          [class.ch-rating__star--readonly]="readonly()"
          [disabled]="disabled()"
          [style.width.px]="starSize()"
          [style.height.px]="starSize()"
          [attr.aria-label]="(star.index + 1) + ' star' + (star.index + 1 === 1 ? '' : 's')"
          [attr.aria-checked]="star.state === 'filled'"
          role="radio"
          (click)="onStarClick(star.index)"
          (mousemove)="onStarHover(star.index, $event)"
        >
          @if (star.state === 'filled' || (star.preview && !star.halfPreview)) {
            <svg
              [attr.width]="starSize()"
              [attr.height]="starSize()"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
              />
            </svg>
          } @else if (star.state === 'half' || star.halfPreview) {
            <svg
              [attr.width]="starSize()"
              [attr.height]="starSize()"
              viewBox="0 0 24 24"
            >
              <defs>
                <clipPath [attr.id]="'half-clip-' + star.index">
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
                [attr.clip-path]="'url(#half-clip-' + star.index + ')'"
              />
            </svg>
          } @else {
            <svg
              [attr.width]="starSize()"
              [attr.height]="starSize()"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          }
        </button>
      }
    </div>
  `,
})
export class RatingComponent implements ControlValueAccessor {
  /** Total number of stars to display. */
  count = input<number>(5);

  /** Size of each star: 'sm' (16px), 'md' (20px), or 'lg' (28px). */
  size = input<RatingSize>('md');

  /** Whether the rating is disabled. */
  disabled = input<boolean>(false);

  /** Whether the rating is read-only (displays value but no interaction). */
  readonly = input<boolean>(false);

  /** Whether half-star ratings are allowed. */
  allowHalf = input<boolean>(false);

  /** Color scheme — reserved for theme integration. */
  colorScheme = input<string>('');

  /** Emits whenever the rating value changes. */
  @Output() valueChange = new EventEmitter<number>();

  /** Internal value signal. */
  protected value = signal<number>(0);

  /** Hovered star index (-1 means no hover). */
  protected hoveredIndex = signal<number>(-1);

  /** Whether hover is on the left half of the star (for half-star preview). */
  protected hoveredHalf = signal<boolean>(false);

  /** Resolved pixel size of each star. */
  protected starSize = computed(() => RATING_SIZE_MAP[this.size()]);

  /** Star view-model array used by the template. */
  protected stars = computed(() => {
    const total = this.count();
    const currentValue = this.value();
    const hoverIdx = this.hoveredIndex();
    const isHoverHalf = this.hoveredHalf();
    const halfAllowed = this.allowHalf();
    const isReadonly = this.readonly();
    const isDisabled = this.disabled();

    const result: Array<{
      index: number;
      state: 'filled' | 'half' | 'empty';
      preview: boolean;
      halfPreview: boolean;
    }> = [];

    for (let i = 0; i < total; i++) {
      let state: 'filled' | 'half' | 'empty' = 'empty';
      let preview = false;
      let halfPreview = false;

      // Determine base state from current value
      if (currentValue >= i + 1) {
        state = 'filled';
      } else if (halfAllowed && currentValue >= i + 0.5 && currentValue < i + 1) {
        state = 'half';
      }

      // Apply hover preview if hovering and not disabled/readonly
      if (hoverIdx >= 0 && !isReadonly && !isDisabled) {
        if (i < hoverIdx) {
          state = 'filled';
          preview = true;
          halfPreview = false;
        } else if (i === hoverIdx) {
          if (halfAllowed && isHoverHalf) {
            state = 'half';
            preview = true;
            halfPreview = true;
          } else {
            state = 'filled';
            preview = true;
            halfPreview = false;
          }
        } else {
          state = 'empty';
          preview = false;
          halfPreview = false;
        }
      }

      result.push({ index: i, state, preview, halfPreview });
    }

    return result;
  });

  // ---- ControlValueAccessor ----
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Disabled state is driven by the input signal; this is a no-op
    // since Angular will set the `disabled` input via reactive forms.
  }

  // ---- Event handlers ----

  protected onStarClick(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    let newValue: number;
    if (this.allowHalf() && this.hoveredHalf()) {
      newValue = index + 0.5;
    } else {
      newValue = index + 1;
    }

    // Toggle off if clicking the same value
    if (newValue === this.value()) {
      newValue = 0;
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
  }

  protected onStarHover(index: number, event: MouseEvent): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    this.hoveredIndex.set(index);

    if (this.allowHalf()) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;
      this.hoveredHalf.set(event.clientX < midpoint);
    } else {
      this.hoveredHalf.set(false);
    }
  }

  protected onMouseLeave(): void {
    this.hoveredIndex.set(-1);
    this.hoveredHalf.set(false);
  }
}
