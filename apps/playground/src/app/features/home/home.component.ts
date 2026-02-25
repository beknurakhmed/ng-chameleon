import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml }  from '@angular/platform-browser';
import { PlaygroundThemeService }   from '../../core/services/theme.service';
import { TranslationService }       from '../../core/i18n/translation.service';

@Component({
  selector:    'pg-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss'],
})
export class HomeComponent {
  protected themeService = inject(PlaygroundThemeService);
  protected i18n         = inject(TranslationService);
  private sanitizer      = inject(DomSanitizer);

  copied = signal(false);

  readonly features: { svg: SafeHtml; titleKey: string; descKey: string }[] = [
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'),
      titleKey: 'home.features.themes',
      descKey: 'home.features.themesDesc',
    },
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'),
      titleKey: 'home.features.components',
      descKey: 'home.features.componentsDesc',
    },
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'),
      titleKey: 'home.features.darkMode',
      descKey: 'home.features.darkModeDesc',
    },
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'),
      titleKey: 'home.features.signals',
      descKey: 'home.features.signalsDesc',
    },
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></svg>'),
      titleKey: 'Accessibility',
      descKey: 'WCAG 2.1 AA — ARIA, keyboard nav, focus management.',
    },
    {
      svg: this.safe('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'),
      titleKey: 'Tree-shakeable',
      descKey: 'Each component < 5kb gzipped. Import only what you need.',
    },
  ];

  readonly author = {
    name:     'Beknur Akhmedov',
    bio:      'Software Engineer | Full-Stack | Machine Learning',
    location: 'Uzbekistan',
    github:   'https://github.com/beknurakhmed',
    linkedin: 'https://linkedin.com/in/beknur-akhmedov-6716292b4',
    avatar:   'https://avatars.githubusercontent.com/u/129836413?v=4',
  };

  copyInstall(): void {
    const text = 'npm install ng-chameleon';
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  private safe(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
