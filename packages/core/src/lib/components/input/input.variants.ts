import { cva } from '../../utils/class-merge.util';

export type InputVariant = 'outline' | 'filled' | 'flushed' | 'unstyled';
export type InputSize    = 'sm' | 'md' | 'lg';

export const inputVariants = cva(
  [
    'w-full font-[--ch-font-body] text-[color:--ch-text] bg-[--ch-input-bg]',
    'placeholder:text-[color:--ch-text-muted]',
    'transition-[border-color,box-shadow] duration-[--ch-duration-base]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none',
  ].join(' '),
  {
    variants: {
      variant: {
        outline: [
          'border border-[color:--ch-input-border] rounded-[--ch-input-radius] px-[--ch-input-px]',
          'hover:border-[color:--ch-input-hover-border]',
          'focus:border-[color:--ch-input-border-focus] focus:ring-[length:0] focus:[box-shadow:--ch-input-ring]',
          'aria-invalid:border-[color:--ch-error] aria-invalid:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--ch-error)_35%,transparent)]',
        ].join(' '),

        filled: [
          'border-2 border-transparent rounded-[--ch-input-radius] px-[--ch-input-px]',
          'bg-[--ch-bg-subtle]',
          'focus:bg-[--ch-bg] focus:border-[color:--ch-input-border-focus]',
          'aria-invalid:border-[color:--ch-error]',
        ].join(' '),

        flushed: [
          'border-b-2 border-[color:--ch-input-border] rounded-none px-0',
          'focus:border-[color:--ch-input-border-focus]',
          'aria-invalid:border-[color:--ch-error]',
        ].join(' '),

        unstyled: 'bg-transparent border-none p-0 focus:shadow-none',
      },

      size: {
        sm: 'h-[--ch-input-height-sm] text-[--ch-text-sm]',
        md: 'h-[--ch-input-height-md] text-[--ch-text-md]',
        lg: 'h-[--ch-input-height-lg] text-[--ch-text-lg]',
      },
    },

    defaultVariants: {
      variant: 'outline',
      size:    'md',
    },
  }
);

export const inputGroupVariants = cva(
  'relative flex items-center w-full',
  {
    variants: {
      size: {
        sm: 'h-[--ch-input-height-sm]',
        md: 'h-[--ch-input-height-md]',
        lg: 'h-[--ch-input-height-lg]',
      },
    },
    defaultVariants: { size: 'md' },
  }
);
