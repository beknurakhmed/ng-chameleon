import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ChameleonThemeService, ChameleonTheme, CHAMELEON_COMPONENTS } from 'ng-chameleon';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [NgFor, ...CHAMELEON_COMPONENTS],
  template: `
    <div chStack spacing="8">

      <div>
        <h1 chText fontSize="3xl" fontWeight="bold" mb="2">Theme Gallery</h1>
        <p chText fontSize="lg" color="gray.500">
          See the same components in 4 different design systems.
          Click a theme to preview it.
        </p>
      </div>

      <!-- Theme switcher cards -->
      <div chGrid cols="4" gap="4">
        <div *ngFor="let t of themes"
          chBox
          [style.border]="themeService.theme() === t.value ? '2px solid var(--ch-primary)' : '1px solid var(--ch-border)'"
          p="4" rounded="lg" cursor="pointer"
          [style.background]="themeService.theme() === t.value ? 'var(--ch-primary-subtle)' : 'var(--ch-bg)'"
          (click)="themeService.setTheme(t.value)">

          <div chFlex justify="between" align="center" mb="2">
            <span chText fontSize="lg">{{ t.emoji }}</span>
            <ch-badge *ngIf="themeService.theme() === t.value" colorScheme="primary">Active</ch-badge>
          </div>

          <p chText fontWeight="bold" mb="1">{{ t.label }}</p>
          <p chText fontSize="sm" color="gray.500">{{ t.description }}</p>
        </div>
      </div>

      <!-- Component preview with current theme -->
      <div>
        <h2 chText fontSize="xl" fontWeight="bold" mb="4">
          Preview: {{ currentThemeLabel() }}
        </h2>

        <ch-card>
          <ch-card-header>Component showcase — {{ currentThemeLabel() }}</ch-card-header>
          <ch-card-body>
            <div chStack spacing="6">

              <!-- Buttons row -->
              <div>
                <p chText fontSize="sm" color="gray.500" mb="3">Buttons</p>
                <div chFlex gap="3" wrap="wrap">
                  <ch-button variant="solid">Solid</ch-button>
                  <ch-button variant="outline">Outline</ch-button>
                  <ch-button variant="ghost">Ghost</ch-button>
                  <ch-button colorScheme="success" variant="solid">Success</ch-button>
                  <ch-button colorScheme="error" variant="solid">Error</ch-button>
                </div>
              </div>

              <ch-divider />

              <!-- Badges row -->
              <div>
                <p chText fontSize="sm" color="gray.500" mb="3">Badges</p>
                <div chFlex gap="2" wrap="wrap">
                  <ch-badge colorScheme="primary">Primary</ch-badge>
                  <ch-badge colorScheme="success">Success</ch-badge>
                  <ch-badge colorScheme="warning">Warning</ch-badge>
                  <ch-badge colorScheme="error">Error</ch-badge>
                  <ch-badge variant="outline" colorScheme="primary">Outlined</ch-badge>
                </div>
              </div>

              <ch-divider />

              <!-- Token visualization -->
              <div>
                <p chText fontSize="sm" color="gray.500" mb="3">Design tokens</p>
                <div chGrid cols="3" gap="3">
                  <div *ngFor="let token of colorTokens"
                    chBox rounded="md" p="3" [style]="token.style">
                    <p chText fontSize="xs" fontWeight="medium" color="white">{{ token.name }}</p>
                    <p chText fontSize="xs" color="white" style="opacity:0.8">{{ token.cssVar }}</p>
                  </div>
                </div>
              </div>

            </div>
          </ch-card-body>
        </ch-card>
      </div>

    </div>
  `,
})
export class ThemesComponent {
  protected themeService = inject(ChameleonThemeService);

  protected themes = [
    { value: 'shadcn'   as ChameleonTheme, label: 'Shadcn/ui',     emoji: '⚫', description: 'Minimal, accessible, dark-first' },
    { value: 'chakra'   as ChameleonTheme, label: 'Chakra UI',      emoji: '🔵', description: 'Friendly blue, rounded, warm' },
    { value: 'material' as ChameleonTheme, label: 'Material Design', emoji: '🟣', description: 'Google Material, elevated shadows' },
    { value: 'antd'     as ChameleonTheme, label: 'Ant Design',      emoji: '🔴', description: 'Enterprise-grade, precise, Chinese' },
  ];

  protected colorTokens = [
    { name: 'Primary',   cssVar: '--ch-primary',  style: 'background:var(--ch-primary)' },
    { name: 'Success',   cssVar: '--ch-success',  style: 'background:var(--ch-success)' },
    { name: 'Warning',   cssVar: '--ch-warning',  style: 'background:var(--ch-warning)' },
    { name: 'Error',     cssVar: '--ch-error',    style: 'background:var(--ch-error)' },
    { name: 'Info',      cssVar: '--ch-info',     style: 'background:var(--ch-info)' },
    { name: 'Secondary', cssVar: '--ch-secondary',style: 'background:var(--ch-secondary)' },
  ];

  protected currentThemeLabel(): string {
    return this.themes.find(t => t.value === this.themeService.theme())?.label ?? '';
  }
}
