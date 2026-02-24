import { Injectable, inject } from '@angular/core';
import { ChameleonThemeService, ChameleonTheme, ChameleonColorMode } from 'ng-chameleon';

/**
 * PlaygroundThemeService — thin wrapper around ChameleonThemeService.
 * Provides playground-specific helpers and metadata about each theme.
 */
@Injectable({ providedIn: 'root' })
export class PlaygroundThemeService {
  private readonly chameleon = inject(ChameleonThemeService);

  // Expose signals from ChameleonThemeService
  readonly theme      = this.chameleon.theme;
  readonly colorMode  = this.chameleon.colorMode;
  readonly isDark     = this.chameleon.isDark;

  readonly availableThemes: ThemeMeta[] = [
    {
      value:       'shadcn',
      label:       'Shadcn/ui',
      emoji:       '⚫',
      description: 'Minimal, accessible, dark-first. Based on Radix UI primitives.',
      primaryColor:'hsl(222.2 47.4% 11.2%)',
      font:        'Inter',
      style:       'Modern, minimalist',
      origin:      'vercel/shadcn-ui',
    },
    {
      value:       'chakra',
      label:       'Chakra UI',
      emoji:       '🔵',
      description: 'Friendly, accessible, blue-accented. Inspired by Tailwind.',
      primaryColor:'#3182CE',
      font:        'Inter',
      style:       'Friendly, rounded',
      origin:      'chakra-ui/chakra-ui',
    },
    {
      value:       'material',
      label:       'Material Design 3',
      emoji:       '🟣',
      description: 'Google M3 spec. Expressive shapes, tonal colors, emphasized motion.',
      primaryColor:'#6750A4',
      font:        'Roboto',
      style:       'Expressive, rounded',
      origin:      'angular/components',
    },
    {
      value:       'antd',
      label:       'Ant Design 5',
      emoji:       '🔴',
      description: 'Enterprise-grade. Precise, compact. Used in 90% of Chinese enterprise apps.',
      primaryColor:'#1677ff',
      font:        '-apple-system',
      style:       'Compact, precise',
      origin:      'ant-design/ant-design',
    },
  ];

  setTheme(theme: ChameleonTheme): void {
    this.chameleon.setTheme(theme);
  }

  setColorMode(mode: ChameleonColorMode): void {
    this.chameleon.setColorMode(mode);
  }

  toggleColorMode(): void {
    this.chameleon.toggleColorMode();
  }

  getThemeMeta(theme: ChameleonTheme): ThemeMeta | undefined {
    return this.availableThemes.find(t => t.value === theme);
  }

  getCurrentThemeMeta(): ThemeMeta | undefined {
    return this.getThemeMeta(this.theme());
  }
}

export interface ThemeMeta {
  value:        ChameleonTheme;
  label:        string;
  emoji:        string;
  description:  string;
  primaryColor: string;
  font:         string;
  style:        string;
  origin:       string;
}
