import {
  Component, Input, ChangeDetectionStrategy,
  computed, ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';

export type ProgressVariant = 'default' | 'striped' | 'animated';

@Component({
  selector: 'ch-progress',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-progress-wrapper">
      <div *ngIf="label || showValue" class="ch-progress__label-row">
        <span *ngIf="label" class="ch-progress__label">{{ label }}</span>
        <span *ngIf="showValue" class="ch-progress__value">{{ clampedValue() }}%</span>
      </div>

      <div class="ch-progress"
        [class]="trackClass()"
        role="progressbar"
        [attr.aria-valuenow]="clampedValue()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max"
        [attr.aria-label]="label || 'Progress'">

        <div class="ch-progress__fill"
          [class]="fillClass()"
          [style.width.%]="clampedValue()">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ch-progress-wrapper { width: 100%; display: flex; flex-direction: column; gap: var(--ch-space-1); }

    .ch-progress__label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ch-progress__label {
      font-size: var(--ch-text-xs);
      font-weight: var(--ch-weight-medium);
      color: var(--ch-text-subtle);
    }

    .ch-progress__value {
      font-size: var(--ch-text-xs);
      color: var(--ch-text-muted);
    }

    .ch-progress {
      width: 100%;
      overflow: hidden;
      background: var(--ch-border);
      border-radius: var(--ch-radius-full);

      &--xs  { height: 4px; }
      &--sm  { height: 6px; }
      &--md  { height: 8px; }
      &--lg  { height: 12px; }
      &--xl  { height: 16px; }
    }

    .ch-progress__fill {
      height: 100%;
      border-radius: var(--ch-radius-full);
      background: var(--ch-primary);
      transition: width var(--ch-transition-slow);

      &--success { background: var(--ch-success); }
      &--warning { background: var(--ch-warning); }
      &--error   { background: var(--ch-error); }
      &--info    { background: var(--ch-info); }
      &--secondary { background: var(--ch-secondary, var(--ch-text-muted)); }
      &--gray    { background: var(--ch-gray-500, #6b7280); }

      &--striped {
        background-image: linear-gradient(
          45deg,
          rgba(255,255,255,0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255,255,255,0.15) 50%,
          rgba(255,255,255,0.15) 75%,
          transparent 75%
        );
        background-size: 1rem 1rem;
      }

      &--animated {
        background-image: linear-gradient(
          45deg,
          rgba(255,255,255,0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255,255,255,0.15) 50%,
          rgba(255,255,255,0.15) 75%,
          transparent 75%
        );
        background-size: 1rem 1rem;
        animation: ch-progress-stripes 1s linear infinite;
      }
    }

    @keyframes ch-progress-stripes {
      from { background-position: 1rem 0; }
      to   { background-position: 0 0; }
    }
  `],
})
export class ChProgressComponent {
  @Input() value  = 0;
  @Input() max    = 100;
  @Input() size: ChameleonSize = 'md';
  @Input() colorScheme: ChameleonColorScheme = 'primary';
  @Input() variant: ProgressVariant = 'default';
  @Input() label?: string;
  @Input() showValue = false;

  readonly clampedValue = computed(() =>
    Math.round(Math.min(Math.max(this.value, 0), this.max) / this.max * 100)
  );

  readonly trackClass = computed(() => `ch-progress--${this.size}`);

  readonly fillClass = computed(() => {
    const cls: string[] = [];
    if (this.colorScheme !== 'primary') cls.push(`ch-progress__fill--${this.colorScheme}`);
    if (this.variant === 'striped')     cls.push('ch-progress__fill--striped');
    if (this.variant === 'animated')    cls.push('ch-progress__fill--animated');
    return cls.join(' ');
  });
}
