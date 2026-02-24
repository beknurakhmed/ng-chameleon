import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChameleonTheme, ChameleonColorMode, ChameleonThemeConfig } from '../tokens/design-tokens.interface';

const STORAGE_KEY_THEME     = 'ch-theme';
const STORAGE_KEY_COLOR_MODE = 'ch-color-mode';

@Injectable({ providedIn: 'root' })
export class ChameleonThemeService {
  private readonly isBrowser: boolean;

  // ── Signals ──────────────────────────────────────────────────────────
  readonly theme     = signal<ChameleonTheme>('shadcn');
  readonly colorMode = signal<ChameleonColorMode>('system');

  /** Resolved color mode: 'light' | 'dark' (never 'system') */
  readonly resolvedColorMode = computed<'light' | 'dark'>(() => {
    const mode = this.colorMode();
    if (mode !== 'system') return mode;
    if (!this.isBrowser) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  readonly isDark = computed(() => this.resolvedColorMode() === 'dark');

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.restoreFromStorage();
    this.watchSystemColorScheme();

    // Auto-apply theme to DOM whenever it changes
    effect(() => {
      this.applyToDom(this.theme(), this.resolvedColorMode());
    });
  }

  // ── Public API ────────────────────────────────────────────────────────

  setTheme(theme: ChameleonTheme): void {
    this.theme.set(theme);
    this.persist(STORAGE_KEY_THEME, theme);
  }

  setColorMode(mode: ChameleonColorMode): void {
    this.colorMode.set(mode);
    this.persist(STORAGE_KEY_COLOR_MODE, mode);
  }

  toggleColorMode(): void {
    this.setColorMode(this.resolvedColorMode() === 'dark' ? 'light' : 'dark');
  }

  /** Read a single CSS token value from the DOM */
  getToken(tokenName: string, element?: HTMLElement): string {
    if (!this.isBrowser) return '';
    const el = element ?? document.documentElement;
    return getComputedStyle(el).getPropertyValue(tokenName).trim();
  }

  /** Apply custom token overrides to a specific element */
  applyOverrides(overrides: Record<string, string>, element?: HTMLElement): void {
    if (!this.isBrowser) return;
    const el = element ?? document.documentElement;
    Object.entries(overrides).forEach(([token, value]) => {
      el.style.setProperty(token, value);
    });
  }

  /** Remove custom overrides */
  removeOverrides(tokens: string[], element?: HTMLElement): void {
    if (!this.isBrowser) return;
    const el = element ?? document.documentElement;
    tokens.forEach(token => el.style.removeProperty(token));
  }

  // ── Private ───────────────────────────────────────────────────────────

  private applyToDom(theme: ChameleonTheme, colorMode: 'light' | 'dark'): void {
    if (!this.isBrowser) return;

    const body = document.body;

    // Remove all theme classes
    body.classList.remove(
      'ch-theme-chakra',
      'ch-theme-material',
      'ch-theme-antd',
      'ch-theme-shadcn'
    );

    // Add new theme class
    body.classList.add(`ch-theme-${theme}`);

    // Set data attributes (for CSS targeting)
    body.setAttribute('data-ch-theme', theme);
    body.setAttribute('data-ch-color-mode', colorMode);

    // Toggle dark class (for Tailwind dark: variant)
    body.classList.toggle('dark', colorMode === 'dark');
  }

  private restoreFromStorage(): void {
    if (!this.isBrowser) return;

    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ChameleonTheme | null;
    const savedMode  = localStorage.getItem(STORAGE_KEY_COLOR_MODE) as ChameleonColorMode | null;

    if (savedTheme)  this.theme.set(savedTheme);
    if (savedMode)   this.colorMode.set(savedMode);
  }

  private watchSystemColorScheme(): void {
    if (!this.isBrowser) return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', () => {
      // Re-run effect by touching colorMode signal when in system mode
      if (this.colorMode() === 'system') {
        this.applyToDom(this.theme(), this.resolvedColorMode());
      }
    });
  }

  private persist(key: string, value: string): void {
    if (!this.isBrowser) return;
    try { localStorage.setItem(key, value); } catch { /* quota exceeded */ }
  }
}
