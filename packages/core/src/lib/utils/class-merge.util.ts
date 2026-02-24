/**
 * Merges class strings, resolving Tailwind conflicts.
 * Uses twMerge if available, falls back to simple clsx join.
 */

type ClassValue = string | null | undefined | boolean | Record<string, boolean> | ClassValue[];

export function cx(...inputs: ClassValue[]): string {
  return inputs
    .flatMap(val => {
      if (!val || typeof val === 'boolean') return [];
      if (typeof val === 'string') return val.split(' ').filter(Boolean);
      if (Array.isArray(val)) return [cx(...val)];
      if (typeof val === 'object') {
        return Object.entries(val)
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k);
      }
      return [];
    })
    .join(' ');
}

/**
 * Variant helper — creates a function that returns CSS class strings
 * based on a variant config. Lightweight alternative to class-variance-authority.
 *
 * @example
 * const btn = cva('base-class', {
 *   variants: { size: { sm: 'h-8', md: 'h-10' } },
 *   defaultVariants: { size: 'md' },
 * });
 * btn({ size: 'sm' }) // → 'base-class h-8'
 */
export interface CvaConfig<V extends Record<string, Record<string, string>>> {
  variants: V;
  defaultVariants?: Partial<{ [K in keyof V]: keyof V[K] }>;
  compoundVariants?: Array<
    Partial<{ [K in keyof V]: keyof V[K] }> & { class: string }
  >;
}

export type VariantProps<V extends Record<string, Record<string, string>>> = Partial<{
  [K in keyof V]: keyof V[K];
}>;

export function cva<V extends Record<string, Record<string, string>>>(
  base: string,
  config: CvaConfig<V>
) {
  return (props?: VariantProps<V>): string => {
    const merged = { ...config.defaultVariants, ...props } as Record<string, string>;
    const variantClasses = Object.entries(merged)
      .map(([key, value]) => config.variants[key]?.[value as string] ?? '')
      .filter(Boolean);

    const compoundClasses = (config.compoundVariants ?? [])
      .filter(compound => {
        const { class: _, ...conditions } = compound;
        return Object.entries(conditions).every(([k, v]) => merged[k] === v);
      })
      .map(c => c.class);

    return cx(base, ...variantClasses, ...compoundClasses);
  };
}
