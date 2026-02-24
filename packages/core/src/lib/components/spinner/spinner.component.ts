import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { ChameleonSize } from '../../tokens/design-tokens.interface';

const SIZE_MAP: Record<ChameleonSize, string> = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
};

const THICKNESS_MAP: Record<ChameleonSize, string> = {
  xs: '2px',
  sm: '2px',
  md: '3px',
  lg: '3px',
  xl: '4px',
};

/**
 * Spinner — loading indicator.
 *
 * @example
 * <ch-spinner size="md" colorScheme="primary" />
 * <ch-spinner label="Loading data..." />
 */
@Component({
  selector: 'ch-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'status',
    '[attr.aria-label]': 'label || "Loading"',
    'style': 'display:inline-flex;align-items:center;justify-content:center',
  },
  template: `
    <svg
      [style.width]="svgSize()"
      [style.height]="svgSize()"
      viewBox="0 0 50 50"
      fill="none"
      aria-hidden="true"
      style="animation: ch-spin 0.75s linear infinite">
      <!-- Background track -->
      <circle
        cx="25" cy="25" r="20"
        [attr.stroke-width]="thickness()"
        style="stroke: currentColor; opacity: 0.2"/>
      <!-- Spinning arc -->
      <path
        d="M25 5 A20 20 0 0 1 45 25"
        [attr.stroke-width]="thickness()"
        stroke="currentColor"
        stroke-linecap="round"/>
    </svg>
    <span *ngIf="label" class="sr-only">{{ label }}</span>
  `,
  styles: [`
    :host { color: var(--ch-primary); }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `],
})
export class ChSpinnerComponent {
  @Input() size: ChameleonSize = 'md';
  @Input() label = '';
  @Input() color?: string;

  readonly svgSize  = computed(() => SIZE_MAP[this.size] ?? '1.5rem');
  readonly thickness = computed(() => THICKNESS_MAP[this.size] ?? '3px');
}
