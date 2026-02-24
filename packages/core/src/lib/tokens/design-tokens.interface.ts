/**
 * Universal design token contract.
 * All 4 themes must implement these CSS custom properties.
 * This interface documents the expected tokens — actual values live in CSS files.
 */
export type ChameleonTheme = 'chakra' | 'material' | 'antd' | 'shadcn';

export type ChameleonColorMode = 'light' | 'dark' | 'system';

export type ChameleonColorScheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'gray';

export type ChameleonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ChameleonThemeConfig {
  theme: ChameleonTheme;
  colorMode: ChameleonColorMode;
  /** CSS selector to apply theme to. Defaults to 'body'. */
  selector?: string;
  /** Override specific CSS tokens */
  overrides?: Record<string, string>;
}

/** Token names for type-safe access in TypeScript */
export const CH_TOKENS = {
  primary:       '--ch-primary',
  primaryHover:  '--ch-primary-hover',
  primarySubtle: '--ch-primary-subtle',
  primaryFg:     '--ch-primary-fg',
  secondary:     '--ch-secondary',
  success:       '--ch-success',
  warning:       '--ch-warning',
  error:         '--ch-error',
  info:          '--ch-info',
  bg:            '--ch-bg',
  bgSubtle:      '--ch-bg-subtle',
  bgElevated:    '--ch-bg-elevated',
  text:          '--ch-text',
  textSubtle:    '--ch-text-subtle',
  textMuted:     '--ch-text-muted',
  border:        '--ch-border',
  borderStrong:  '--ch-border-strong',
  radiusSm:      '--ch-radius-sm',
  radiusMd:      '--ch-radius-md',
  radiusLg:      '--ch-radius-lg',
  shadowSm:      '--ch-shadow-sm',
  shadowMd:      '--ch-shadow-md',
  shadowLg:      '--ch-shadow-lg',
} as const;

export type ChameleonTokenKey = keyof typeof CH_TOKENS;
