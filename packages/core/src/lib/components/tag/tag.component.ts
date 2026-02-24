import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { cva, cx } from '../../utils/class-merge.util';
import { ChameleonColorScheme, ChameleonSize } from '../../tokens/design-tokens.interface';

export type TagVariant = 'solid' | 'subtle' | 'outline';

const tagVariants = cva(
  [
    'inline-flex items-center gap-1',
    'font-[--ch-weight-medium] whitespace-nowrap',
    'transition-colors duration-[--ch-duration-fast]',
  ].join(' '),
  {
    variants: {
      variant: {
        solid:   'bg-[--ch-primary] text-[--ch-primary-fg]',
        subtle:  'bg-[--ch-primary-subtle] text-[color:--ch-primary]',
        outline: 'border border-[color:--ch-primary] text-[color:--ch-primary]',
      },
      size: {
        sm: 'text-[--ch-text-xs] px-2 py-0.5 rounded-[--ch-radius-sm]',
        md: 'text-[--ch-text-sm] px-2.5 py-1 rounded-[--ch-radius-md]',
        lg: 'text-[--ch-text-md] px-3 py-1.5 rounded-[--ch-radius-md]',
      },
    },
    defaultVariants: { variant: 'subtle', size: 'md' },
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
 * Tag / Chip — removable label component.
 *
 * @example
 * <ch-tag colorScheme="primary" [closable]="true" (closed)="removeTag()">
 *   Angular
 * </ch-tag>
 */
@Component({
  selector: 'ch-tag',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'tagClass()',
    '[style]': 'tagStyle()',
  },
  template: `
    <ng-content/>

    <button
      *ngIf="closable"
      type="button"
      class="ch-tag-close"
      [attr.aria-label]="'Remove ' + (label || 'tag')"
      (click)="close($event)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
           width="0.75em" height="0.75em" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `,
  styles: [`
    .ch-tag-close {
      display: inline-flex; align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer;
      padding: 0; margin-left: 0.125rem;
      opacity: 0.7; color: currentColor;
      border-radius: 50%;
      transition: opacity var(--ch-transition-fast), background var(--ch-transition-fast);
    }
    .ch-tag-close:hover   { opacity: 1; background: rgba(0,0,0,0.1); }
    .ch-tag-close:focus-visible { outline: 2px solid currentColor; outline-offset: 1px; }
  `],
})
export class ChTagComponent {
  @Input() variant: TagVariant = 'subtle';
  @Input() colorScheme: ChameleonColorScheme = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() closable = false;
  @Input() label?: string;

  readonly closed = output<void>();

  readonly tagClass = computed(() => tagVariants({ variant: this.variant, size: this.size }));
  readonly tagStyle = computed(() => COLOR_SCHEME_VARS[this.colorScheme] || null);

  close(event: MouseEvent): void {
    event.stopPropagation();
    this.closed.emit();
  }
}
