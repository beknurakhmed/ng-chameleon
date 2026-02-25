import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-statistic',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-statistic" [class.ch-statistic--loading]="loading">
      <!-- Loading skeleton -->
      <ng-container *ngIf="loading; else content">
        <div class="ch-statistic__skeleton">
          <div class="ch-statistic__skeleton-title"></div>
          <div class="ch-statistic__skeleton-value"></div>
        </div>
      </ng-container>

      <ng-template #content>
        <div class="ch-statistic__title" *ngIf="title">
          {{ title }}
        </div>

        <div class="ch-statistic__value" [attr.style]="valueStyle || null">
          <span class="ch-statistic__prefix" *ngIf="prefix">{{ prefix }}</span>
          <span class="ch-statistic__number">{{ formattedValue }}</span>
          <span class="ch-statistic__suffix" *ngIf="suffix">{{ suffix }}</span>

          <span
            class="ch-statistic__trend"
            *ngIf="trend"
            [class.ch-statistic__trend--up]="trend === 'up'"
            [class.ch-statistic__trend--down]="trend === 'down'"
          >
            <!-- Up arrow -->
            <svg
              *ngIf="trend === 'up'"
              class="ch-statistic__trend-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>

            <!-- Down arrow -->
            <svg
              *ngIf="trend === 'down'"
              class="ch-statistic__trend-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :root {
        --ch-statistic-title-color: var(--ch-text-muted, #6b7280);
        --ch-statistic-title-font-size: var(--ch-font-size-sm, 0.875rem);
        --ch-statistic-value-color: var(--ch-text, #111827);
        --ch-statistic-value-font-size: var(--ch-font-size-2xl, 1.75rem);
        --ch-statistic-value-font-weight: var(--ch-font-weight-bold, 700);
        --ch-statistic-prefix-suffix-gap: 0.25em;
        --ch-statistic-trend-size: 1em;
        --ch-statistic-gap: 0.25rem;
        --ch-success: #10b981;
        --ch-error: #ef4444;
      }

      .ch-statistic {
        display: inline-flex;
        flex-direction: column;
        gap: var(--ch-statistic-gap);
        font-family: var(--ch-font-family, inherit);
      }

      .ch-statistic__title {
        font-size: var(--ch-statistic-title-font-size);
        color: var(--ch-statistic-title-color);
        line-height: 1.4;
      }

      .ch-statistic__value {
        display: inline-flex;
        align-items: baseline;
        gap: var(--ch-statistic-prefix-suffix-gap);
        font-size: var(--ch-statistic-value-font-size);
        font-weight: var(--ch-statistic-value-font-weight);
        color: var(--ch-statistic-value-color);
        line-height: 1.2;
      }

      .ch-statistic__prefix,
      .ch-statistic__suffix {
        font-size: 0.75em;
        font-weight: 400;
        color: var(--ch-statistic-title-color);
      }

      .ch-statistic__trend {
        display: inline-flex;
        align-items: center;
        margin-left: 0.25em;
      }

      .ch-statistic__trend--up {
        color: var(--ch-success);
      }

      .ch-statistic__trend--down {
        color: var(--ch-error);
      }

      .ch-statistic__trend-icon {
        width: var(--ch-statistic-trend-size);
        height: var(--ch-statistic-trend-size);
      }

      /* Skeleton / loading pulse */
      .ch-statistic__skeleton {
        display: flex;
        flex-direction: column;
        gap: var(--ch-statistic-gap);
      }

      .ch-statistic__skeleton-title,
      .ch-statistic__skeleton-value {
        border-radius: 4px;
        background: linear-gradient(
          90deg,
          var(--ch-skeleton-from, #e5e7eb) 25%,
          var(--ch-skeleton-to, #f3f4f6) 50%,
          var(--ch-skeleton-from, #e5e7eb) 75%
        );
        background-size: 200% 100%;
        animation: ch-statistic-pulse 1.5s ease-in-out infinite;
      }

      .ch-statistic__skeleton-title {
        width: 5rem;
        height: var(--ch-statistic-title-font-size);
      }

      .ch-statistic__skeleton-value {
        width: 8rem;
        height: var(--ch-statistic-value-font-size);
      }

      @keyframes ch-statistic-pulse {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class StatisticComponent {
  @Input() title: string = '';
  @Input() value: number | string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() precision: number | undefined;
  @Input() loading: boolean = false;
  @Input() valueStyle: string = '';
  @Input() trend: 'up' | 'down' | null = null;

  get formattedValue(): string {
    if (typeof this.value === 'number' && this.precision !== undefined) {
      return this.value.toFixed(this.precision);
    }
    return String(this.value);
  }
}
