import { Component, inject } from '@angular/core';
import { ChameleonTheme } from 'ng-chameleon';
import { PlaygroundThemeService, ThemeMeta } from '../../../core/services/theme.service';

@Component({
  selector: 'pg-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent {
  protected themeService = inject(PlaygroundThemeService);
  protected themes: ThemeMeta[] = this.themeService.availableThemes;

  setTheme(theme: ChameleonTheme): void {
    this.themeService.setTheme(theme);
  }

  toggleDark(): void {
    this.themeService.toggleColorMode();
  }
}
