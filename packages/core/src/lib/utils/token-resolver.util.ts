/**
 * Resolves style-prop values to CSS values.
 *
 * Resolution order:
 * 1. Theme semantic token: "primary", "primary.500" → var(--ch-primary), var(--ch-primary-500)
 * 2. Spacing scale:        "4" → var(--ch-space-4)
 * 3. Tailwind class:       "blue-500" → returns class name
 * 4. Raw value:            "#FF0000", "1rem", "auto" → returns as-is
 */

const SEMANTIC_COLORS = new Set([
  'primary', 'secondary', 'success', 'warning', 'error', 'info', 'gray',
]);

const SPACING_SCALE = new Set([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '14', '16', '20', '24',
]);

const RADIUS_MAP: Record<string, string> = {
  none: 'var(--ch-radius-none)',
  sm:   'var(--ch-radius-sm)',
  md:   'var(--ch-radius-md)',
  lg:   'var(--ch-radius-lg)',
  xl:   'var(--ch-radius-xl)',
  '2xl':'var(--ch-radius-2xl)',
  full: 'var(--ch-radius-full)',
};

const SHADOW_MAP: Record<string, string> = {
  xs: 'var(--ch-shadow-xs)',
  sm: 'var(--ch-shadow-sm)',
  md: 'var(--ch-shadow-md)',
  lg: 'var(--ch-shadow-lg)',
  xl: 'var(--ch-shadow-xl)',
};

export interface StylePropResolution {
  type: 'cssVar' | 'twClass' | 'rawValue';
  value: string;
  /** CSS property to set (for cssVar / rawValue) */
  property?: string;
}

export function resolveColor(value: string): string {
  if (!value) return '';

  // "primary" → var(--ch-primary)
  if (SEMANTIC_COLORS.has(value)) {
    return `var(--ch-${value})`;
  }

  // "primary.500" → var(--ch-primary-500)
  if (value.includes('.') && SEMANTIC_COLORS.has(value.split('.')[0])) {
    const [color, shade] = value.split('.');
    return `var(--ch-${color}-${shade})`;
  }

  // "blue-500", "gray-100" → Tailwind class token
  if (/^[a-z]+-\d{2,3}$/.test(value)) {
    return `var(--tw-${value}, ${value})`;
  }

  // Raw: "#FF0000", "rgb(...)", "transparent", "inherit"
  return value;
}

export function resolveSpacing(value: string | number): string {
  if (value === undefined || value === null) return '';
  const str = String(value);

  // Numeric shorthand → CSS variable
  if (SPACING_SCALE.has(str)) {
    return `var(--ch-space-${str})`;
  }

  // Already has units → raw
  if (/^\d+(\.\d+)?(px|rem|em|%|vw|vh)$/.test(str)) {
    return str;
  }

  return str;
}

export function resolveRadius(value: string): string {
  return RADIUS_MAP[value] ?? value;
}

export function resolveShadow(value: string): string {
  return SHADOW_MAP[value] ?? value;
}

/** Map style prop name to CSS property */
export const STYLE_PROP_MAP: Record<string, string> = {
  bg:         'background-color',
  bgColor:    'background-color',
  color:      'color',
  p:          'padding',
  px:         'padding-inline',
  py:         'padding-block',
  pt:         'padding-top',
  pr:         'padding-right',
  pb:         'padding-bottom',
  pl:         'padding-left',
  m:          'margin',
  mx:         'margin-inline',
  my:         'margin-block',
  mt:         'margin-top',
  mr:         'margin-right',
  mb:         'margin-bottom',
  ml:         'margin-left',
  w:          'width',
  h:          'height',
  minW:       'min-width',
  maxW:       'max-width',
  minH:       'min-height',
  maxH:       'max-height',
  rounded:    'border-radius',
  border:     'border-width',
  borderColor:'border-color',
  shadow:     'box-shadow',
  opacity:    'opacity',
  zIndex:     'z-index',
  cursor:     'cursor',
  overflow:   'overflow',
  overflowX:  'overflow-x',
  overflowY:  'overflow-y',
  position:   'position',
  top:        'top',
  right:      'right',
  bottom:     'bottom',
  left:       'left',
  display:    'display',
};

export function resolveStyleProp(
  prop: string,
  value: string | number | undefined
): { property: string; value: string } | null {
  if (value === undefined || value === null || value === '') return null;

  const property = STYLE_PROP_MAP[prop];
  if (!property) return null;

  let resolvedValue: string;

  switch (prop) {
    case 'bg':
    case 'bgColor':
    case 'color':
    case 'borderColor':
      resolvedValue = resolveColor(String(value));
      break;

    case 'p': case 'px': case 'py':
    case 'pt': case 'pr': case 'pb': case 'pl':
    case 'm': case 'mx': case 'my':
    case 'mt': case 'mr': case 'mb': case 'ml':
    case 'w': case 'h':
    case 'minW': case 'maxW': case 'minH': case 'maxH':
    case 'top': case 'right': case 'bottom': case 'left':
      resolvedValue = resolveSpacing(value);
      break;

    case 'rounded':
      resolvedValue = resolveRadius(String(value));
      break;

    case 'shadow':
      resolvedValue = resolveShadow(String(value));
      break;

    default:
      resolvedValue = String(value);
  }

  return { property, value: resolvedValue };
}
