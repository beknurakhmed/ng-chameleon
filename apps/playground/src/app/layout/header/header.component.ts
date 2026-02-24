import { Component, inject, signal } from '@angular/core';
import { LoadingService }     from '../../core/services/loading.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector:    'pg-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss'],
})
export class HeaderComponent {
  protected loading = inject(LoadingService);
  protected i18n    = inject(TranslationService);

  readonly mobileMenuOpen = signal(false);

  readonly navLinks = [
    { path: '/',           key: 'nav.home',       exact: true  },
    { path: '/components', key: 'nav.components', exact: false },
    { path: '/themes',     key: 'nav.themes',     exact: false },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
