import { Component, inject, computed } from '@angular/core';
import { PlaygroundThemeService } from '../../core/services/theme.service';
import { TranslationService }     from '../../core/i18n/translation.service';

@Component({
  selector:    'pg-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss'],
})
export class HomeComponent {
  protected themeService = inject(PlaygroundThemeService);
  protected i18n         = inject(TranslationService);

  readonly installCode = `# 1. Install
ng add ng-chameleon

# 2. Add components (shadcn-style)
ng g ng-chameleon:add button card input badge alert

# 3. Use in template
<ch-button variant="solid" colorScheme="primary">
  Click me
</ch-button>

# 4. Style props (like Chakra UI)
<div chBox bg="primary.500" p="4" rounded="lg">
  <span chText fontSize="xl" fontWeight="bold">
    Styled content
  </span>
</div>

# 5. Switch theme at runtime (zero rebuild!)
themeService.setTheme('material');`;

  readonly features = [
    { icon: '🎨', titleKey: 'home.features.themes',      descKey: 'home.features.themesDesc'      },
    { icon: '🧩', titleKey: 'home.features.components',  descKey: 'home.features.componentsDesc'  },
    { icon: '🌙', titleKey: 'home.features.darkMode',    descKey: 'home.features.darkModeDesc'    },
    { icon: '⚡', titleKey: 'home.features.signals',     descKey: 'home.features.signalsDesc'     },
    { icon: '♿', titleKey: 'Accessibility',              descKey: 'WCAG 2.1 AA — ARIA, keyboard nav, focus management.' },
    { icon: '📦', titleKey: 'Tree-shakeable',            descKey: 'Each component < 5kb gzipped. Import only what you need.' },
  ];

  readonly author = {
    name:     'Beknur Akhmedov',
    bio:      'Software Engineer | Full-Stack | Machine Learning',
    location: 'Uzbekistan',
    github:   'https://github.com/beknurakhmed',
    linkedin: 'https://linkedin.com/in/beknur-akhmedov-6716292b4',
    avatar:   'https://avatars.githubusercontent.com/u/129836413?v=4',
  };
}
