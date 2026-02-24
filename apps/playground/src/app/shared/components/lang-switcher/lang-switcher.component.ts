import { Component, inject } from '@angular/core';
import { TranslationService, Lang } from '../../../core/i18n/translation.service';

@Component({
  selector: 'pg-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls:   ['./lang-switcher.component.scss'],
})
export class LangSwitcherComponent {
  protected readonly svc = inject(TranslationService);

  readonly langs: { code: Lang; flag: string }[] = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'ru', flag: '🇷🇺' },
    { code: 'uz', flag: '🇺🇿' },
  ];

  setLang(lang: Lang): void {
    this.svc.setLang(lang);
  }
}
