import { Injectable, signal, computed } from '@angular/core';
import { en, Translation } from './translations/en';
import { ru } from './translations/ru';
import { uz } from './translations/uz';

export type Lang = 'en' | 'ru' | 'uz';

const STORAGE_KEY = 'pg-lang';

const TRANSLATIONS: Record<Lang, Translation> = { en, ru, uz };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _lang = signal<Lang>(this._loadLang());

  readonly lang    = this._lang.asReadonly();
  readonly t       = computed(() => TRANSLATIONS[this._lang()]);

  setLang(lang: Lang): void {
    this._lang.set(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }

  private _loadLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && stored in TRANSLATIONS) return stored;
    } catch {}
    const browser = navigator.language.split('-')[0] as Lang;
    return browser in TRANSLATIONS ? browser : 'en';
  }
}
