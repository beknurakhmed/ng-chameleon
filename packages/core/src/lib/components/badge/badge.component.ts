import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { cva } from '../../utils/class-merge.util';
import { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-[--ch-badge-font-weight] text-[length:--ch-badge-font-size]',
    'px-[--ch-badge-px] py-[--ch-badge-py]',
    'rounded-[--ch-badge-radius]',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        solid:   'bg-[--ch-primary] text-[--ch-primary-fg]',
        subtle:  'bg-[--ch-primary-subtle] text-[color:--ch-primary]',
        outline: 'border border-[color:--ch-primary] text-[color:--ch-primary]',
      },
    },
    defaultVariants: { variant: 'subtle' },
  }
);

const COLOR_SCHEME_VARS: Record<string, string> = {
  primary:   '',
  secondary: '--ch-primary:var(--ch-secondary);--ch-primary-subtle:var(--ch-secondary-subtle);--ch-primary-fg:#fff',
  success:   '--ch-primary:var(--ch-success);--ch-primary-subtle:var(--ch-success-subtle);--ch-primary-fg:var(--ch-success-fg)',
  warning:   '--ch-primary:var(--ch-warning);--ch-primary-subtle:var(--ch-warning-subtle);--ch-primary-fg:var(--ch-warning-fg)',
  error:     '--ch-primary:var(--ch-error);--ch-primary-subtle:var(--ch-error-subtle);--ch-primary-fg:var(--ch-error-fg)',
  info:      '--ch-primary:var(--ch-info);--ch-primary-subtle:var(--ch-info-subtle);--ch-primary-fg:var(--ch-info-fg)',
  gray:      '--ch-primary:var(--ch-text-muted);--ch-primary-subtle:var(--ch-bg-subtle);--ch-primary-fg:var(--ch-text)',
};

/**
 * Badge — small status indicator.
 *
 * @example
 * <ch-badge colorScheme="success">Active</ch-badge>
 * <ch-badge variant="outline" colorScheme="error">Rejected</ch-badge>
 */
@Component({
  selector: 'ch-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'badgeClass()',
    '[style]': 'badgeStyle()',
  },
  template: `<ng-content/>`,
})
export class ChBadgeComponent {
  @Input() variant: BadgeVariant = 'subtle';
  @Input() colorScheme: ChameleonColorScheme = 'primary';

  readonly badgeClass = computed(() => badgeVariants({ variant: this.variant }));
  readonly badgeStyle = computed(() => COLOR_SCHEME_VARS[this.colorScheme] || null);
}
