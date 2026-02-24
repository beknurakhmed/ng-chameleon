import { cva } from '../../utils/class-merge.util';

export type ButtonVariant    = 'solid' | 'outline' | 'ghost' | 'link' | 'subtle';
export type ButtonColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
export type ButtonSize        = 'xs' | 'sm' | 'md' | 'lg';

export const buttonVariants = cva(
  // Base classes
  [
    'inline-flex items-center justify-center gap-2 font-[--ch-btn-font-weight]',
    'transition-[background-color,border-color,color,box-shadow] duration-[--ch-duration-base]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:--ch-primary]',
    'disabled:opacity-50 disabled:pointer-events-none',
    'select-none whitespace-nowrap',
    'rounded-[--ch-btn-radius]',
  ].join(' '),
  {
    variants: {
      variant: {
        solid: [
          'bg-[--ch-primary] text-[--ch-primary-fg]',
          'hover:bg-[--ch-primary-hover]',
          'active:brightness-95',
        ].join(' '),

        outline: [
          'border border-[color:--ch-primary] text-[color:--ch-primary] bg-transparent',
          'hover:bg-[color:--ch-primary-subtle]',
          'active:brightness-95',
        ].join(' '),

        ghost: [
          'bg-transparent text-[color:--ch-primary]',
          'hover:bg-[color:--ch-primary-subtle]',
          'active:bg-[color:--ch-primary-subtle]',
        ].join(' '),

        link: [
          'bg-transparent text-[color:--ch-primary] underline-offset-4',
          'hover:underline',
          'h-auto! p-0!',
        ].join(' '),

        subtle: [
          'bg-[--ch-primary-subtle] text-[color:--ch-primary]',
          'hover:bg-[color:--ch-primary-subtle] hover:brightness-95',
        ].join(' '),
      },

      size: {
        xs: 'h-7  px-[--ch-btn-px-sm] text-[--ch-text-xs]',
        sm: 'h-[--ch-btn-height-sm] px-[--ch-btn-px-sm] text-[--ch-text-sm]',
        md: 'h-[--ch-btn-height-md] px-[--ch-btn-px-md] text-[--ch-text-sm]',
        lg: 'h-[--ch-btn-height-lg] px-[--ch-btn-px-lg] text-[--ch-text-md]',
      },

      isFullWidth: {
        true:  'w-full',
        false: '',
      },

      isIconOnly: {
        true:  'px-0 aspect-square',
        false: '',
      },
    },

    defaultVariants: {
      variant:     'solid',
      size:        'md',
      isFullWidth: 'false',
      isIconOnly:  'false',
    },
  }
);

/** Color-scheme compound: override CSS vars on the element itself */
export const COLOR_SCHEME_VARS: Record<ButtonColorScheme, string> = {
  primary:   '',   // uses defaults
  secondary: '--ch-primary:var(--ch-secondary);--ch-primary-hover:var(--ch-secondary-hover);--ch-primary-subtle:var(--ch-secondary-subtle);--ch-primary-fg:#FFFFFF',
  success:   '--ch-primary:var(--ch-success);--ch-primary-hover:var(--ch-success-hover);--ch-primary-subtle:var(--ch-success-subtle);--ch-primary-fg:var(--ch-success-fg)',
  warning:   '--ch-primary:var(--ch-warning);--ch-primary-hover:var(--ch-warning-hover);--ch-primary-subtle:var(--ch-warning-subtle);--ch-primary-fg:var(--ch-warning-fg)',
  error:     '--ch-primary:var(--ch-error);--ch-primary-hover:var(--ch-error-hover);--ch-primary-subtle:var(--ch-error-subtle);--ch-primary-fg:var(--ch-error-fg)',
  gray:      '--ch-primary:var(--ch-text-muted);--ch-primary-hover:var(--ch-text-subtle);--ch-primary-subtle:var(--ch-bg-subtle);--ch-primary-fg:var(--ch-text)',
};
