import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  APP_INITIALIZER,
  inject,
} from '@angular/core';
import { ChameleonTheme, ChameleonColorMode, ChameleonThemeConfig } from '../tokens/design-tokens.interface';
import { ChameleonThemeService } from './chameleon-theme.service';

/**
 * Configure ng-chameleon in your application.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideChameleon({ theme: 'chakra', colorMode: 'system' }),
 *   ],
 * };
 */
export function provideChameleon(config: Partial<ChameleonThemeConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const themeService = inject(ChameleonThemeService);
        return () => {
          if (config.theme)     themeService.setTheme(config.theme);
          if (config.colorMode) themeService.setColorMode(config.colorMode);
          if (config.overrides) themeService.applyOverrides(config.overrides);
        };
      },
      multi: true,
    },
  ]);
}

/** Injection token for accessing theme config */
export const CHAMELEON_THEME_CONFIG = {
  theme: 'shadcn' as ChameleonTheme,
  colorMode: 'system' as ChameleonColorMode,
};
