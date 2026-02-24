import { Component, OnInit } from '@angular/core';
import { PlaygroundThemeService, ThemeMeta } from '../../core/services/theme.service';
import { ChameleonThemeService } from 'ng-chameleon';
import type { ChameleonTheme } from 'ng-chameleon';

interface ThemeDemo {
  theme: ChameleonTheme;
  meta:  ThemeMeta;
}

@Component({
  selector: 'app-themes-showcase',
  templateUrl: './themes-showcase.component.html',
  styleUrls: ['./themes-showcase.component.scss'],
})
export class ThemesShowcaseComponent implements OnInit {
  themeDemos: ThemeDemo[] = [];
  activeTheme!: ChameleonTheme;

  readonly themes: ChameleonTheme[] = ['shadcn', 'chakra', 'material', 'antd'];

  codeSnippet = `// Angular CDI — one-liner
import { provideChameleon } from 'ng-chameleon';

bootstrapApplication(AppComponent, {
  providers: [
    provideChameleon({ theme: 'shadcn' }),
  ],
});

// Switch at runtime — zero rebuild
themeService.setTheme('material');`;

  constructor(
    readonly themeService: PlaygroundThemeService,
    readonly chameleonTheme: ChameleonThemeService,
  ) {}

  ngOnInit(): void {
    this.activeTheme = this.chameleonTheme.theme();
    this.themeDemos  = this.themes
      .map(t => ({ theme: t, meta: this.themeService.getThemeMeta(t) }))
      .filter((d): d is ThemeDemo => d.meta !== undefined);
  }

  selectTheme(theme: ChameleonTheme): void {
    this.themeService.setTheme(theme);
    this.activeTheme = theme;
  }

  isActive(theme: ChameleonTheme): boolean {
    return this.chameleonTheme.theme() === theme;
  }
}
