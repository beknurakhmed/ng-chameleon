import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type ChResultStatus =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | '404'
  | '403'
  | '500';

@Component({
  selector: 'ch-result',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-result">
      <!-- Icon / Illustration area -->
      <div class="ch-result__icon" [ngSwitch]="status">

        <!-- Success -->
        <div *ngSwitchCase="'success'" class="ch-result__icon-circle ch-result__icon-circle--success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <!-- Error -->
        <div *ngSwitchCase="'error'" class="ch-result__icon-circle ch-result__icon-circle--error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <!-- Warning -->
        <div *ngSwitchCase="'warning'" class="ch-result__icon-circle ch-result__icon-circle--warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="8" x2="12" y2="14" />
            <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <!-- Info -->
        <div *ngSwitchCase="'info'" class="ch-result__icon-circle ch-result__icon-circle--info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="7" r="0.75" fill="currentColor" stroke="none" />
            <line x1="12" y1="11" x2="12" y2="17" />
          </svg>
        </div>

        <!-- HTTP status codes -->
        <div *ngSwitchCase="'404'" class="ch-result__status-code">404</div>
        <div *ngSwitchCase="'403'" class="ch-result__status-code">403</div>
        <div *ngSwitchCase="'500'" class="ch-result__status-code">500</div>
      </div>

      <!-- Title -->
      @if (title) {
        <div class="ch-result__title">{{ title }}</div>
      }

      <!-- Subtitle -->
      @if (subtitle) {
        <div class="ch-result__subtitle">{{ subtitle }}</div>
      }

      <!-- Action buttons slot -->
      <div class="ch-result__actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .ch-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--ch-space-12, 3rem);
    }

    /* ------------------------------------------------
       Icon area
    ------------------------------------------------ */
    .ch-result__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--ch-space-4, 1rem);
    }

    /* Shared circle styling */
    .ch-result__icon-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      border-radius: 9999px;
    }

    /* Success */
    .ch-result__icon-circle--success {
      background-color: var(--ch-success-subtle, #f0fdf4);
      color: var(--ch-success, #16a34a);
    }

    /* Error */
    .ch-result__icon-circle--error {
      background-color: var(--ch-error-subtle, #fef2f2);
      color: var(--ch-error, #dc2626);
    }

    /* Warning */
    .ch-result__icon-circle--warning {
      background-color: var(--ch-warning-subtle, #fefce8);
      color: var(--ch-warning, #ca8a04);
    }

    /* Info */
    .ch-result__icon-circle--info {
      background-color: var(--ch-info-subtle, #eff6ff);
      color: var(--ch-info, #2563eb);
    }

    /* ------------------------------------------------
       HTTP status code display (404, 403, 500)
    ------------------------------------------------ */
    .ch-result__status-code {
      font-size: var(--ch-font-size-4xl, 2.25rem);
      font-weight: 700;
      line-height: 1;
      color: var(--ch-text-muted, #6b7280);
    }

    /* ------------------------------------------------
       Title
    ------------------------------------------------ */
    .ch-result__title {
      font-size: var(--ch-font-size-xl, 1.25rem);
      font-weight: 600;
      color: var(--ch-text, #111827);
      margin-top: var(--ch-space-2, 0.5rem);
    }

    /* ------------------------------------------------
       Subtitle
    ------------------------------------------------ */
    .ch-result__subtitle {
      font-size: var(--ch-font-size-sm, 0.875rem);
      color: var(--ch-text-muted, #6b7280);
      margin-top: var(--ch-space-2, 0.5rem);
      max-width: 480px;
    }

    /* ------------------------------------------------
       Actions slot
    ------------------------------------------------ */
    .ch-result__actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--ch-space-3, 0.75rem);
      margin-top: var(--ch-space-6, 1.5rem);
    }

    .ch-result__actions:empty {
      display: none;
    }
  `],
})
export class ResultComponent {
  @Input() status: ChResultStatus = 'info';
  @Input() title = '';
  @Input() subtitle = '';
}
