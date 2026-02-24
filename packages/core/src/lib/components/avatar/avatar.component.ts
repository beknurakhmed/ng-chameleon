import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  signal,
  OnChanges,
} from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { ChameleonSize } from '../../tokens/design-tokens.interface';

const SIZE_STYLES: Record<ChameleonSize, { width: string; fontSize: string }> = {
  xs: { width: '1.5rem',  fontSize: '0.6rem'  },
  sm: { width: '2rem',    fontSize: '0.75rem' },
  md: { width: '2.5rem',  fontSize: '0.875rem'},
  lg: { width: '3rem',    fontSize: '1rem'    },
  xl: { width: '4rem',    fontSize: '1.25rem' },
};

/**
 * Avatar — user avatar with image, fallback initials, and group support.
 *
 * @example
 * <ch-avatar name="John Doe" src="/avatar.jpg" size="md" />
 * <ch-avatar name="Jane Smith" colorScheme="success" />
 */
@Component({
  selector: 'ch-avatar',
  standalone: true,
  imports: [NgIf, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"ch-avatar ch-avatar--" + shape',
    '[style.width]': 'sizeStyle().width',
    '[style.height]': 'sizeStyle().width',
    '[style.font-size]': 'sizeStyle().fontSize',
    '[attr.aria-label]': 'name || "Avatar"',
    'role': 'img',
  },
  template: `
    <!-- Image -->
    <img
      *ngIf="src && !imgError()"
      [src]="src"
      [alt]="name || 'Avatar'"
      class="ch-avatar-img"
      (error)="onImgError()"
      (load)="onImgLoad()"
    />

    <!-- Fallback: initials or icon -->
    <span *ngIf="!src || imgError()" class="ch-avatar-fallback" [style]="fallbackStyle()">
      <span *ngIf="initials()">{{ initials() }}</span>
      <svg *ngIf="!initials()" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="60%" height="60%">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </span>

    <!-- Online indicator -->
    <span *ngIf="showBadge" class="ch-avatar-badge" [class]="'ch-avatar-badge--' + badgeColor"></span>
  `,
  styles: [`
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      vertical-align: top;
    }
    :host(.ch-avatar--circle)  { border-radius: var(--ch-radius-full); overflow: hidden; }
    :host(.ch-avatar--square)  { border-radius: var(--ch-radius-md);   overflow: hidden; }
    :host(.ch-avatar--rounded) { border-radius: var(--ch-radius-lg);   overflow: hidden; }

    .ch-avatar-img {
      width: 100%; height: 100%;
      object-fit: cover;
    }

    .ch-avatar-fallback {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-weight: var(--ch-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      user-select: none;
    }

    .ch-avatar-badge {
      position: absolute; bottom: 0; right: 0;
      width: 25%; height: 25%;
      border-radius: 50%;
      border: 2px solid var(--ch-bg);
    }
    .ch-avatar-badge--online   { background: var(--ch-success); }
    .ch-avatar-badge--offline  { background: var(--ch-text-muted); }
    .ch-avatar-badge--busy     { background: var(--ch-error); }
    .ch-avatar-badge--away     { background: var(--ch-warning); }
  `],
})
export class ChAvatarComponent implements OnChanges {
  @Input() src?: string;
  @Input() name?: string;
  @Input() size: ChameleonSize = 'md';
  @Input() shape: 'circle' | 'square' | 'rounded' = 'circle';
  @Input() showBadge = false;
  @Input() badgeColor: 'online' | 'offline' | 'busy' | 'away' = 'online';
  @Input() bg?: string;

  readonly imgError = signal(false);
  readonly imgLoaded = signal(false);

  readonly sizeStyle  = computed(() => SIZE_STYLES[this.size] ?? SIZE_STYLES.md);

  readonly initials = computed(() => {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  });

  readonly fallbackStyle = computed(() => {
    const bg = this.bg
      ? `background-color:${this.bg}`
      : `background-color:${this.generateColor(this.name ?? '')}`;
    return `${bg};color:#fff`;
  });

  ngOnChanges(): void {
    this.imgError.set(false);
    this.imgLoaded.set(false);
  }

  onImgError(): void { this.imgError.set(true); }
  onImgLoad():  void { this.imgLoaded.set(true); }

  private generateColor(name: string): string {
    const COLORS = [
      '#E53E3E','#DD6B20','#D69E2E','#38A169','#319795',
      '#3182CE','#5A67D8','#805AD5','#D53F8C','#718096',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  }
}

// ── Avatar Group ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ch-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content/>`,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }
    :host ::ng-deep ch-avatar {
      margin-left: -0.5rem;
      border: 2px solid var(--ch-bg);
    }
    :host ::ng-deep ch-avatar:first-child { margin-left: 0; }
  `],
})
export class ChAvatarGroupComponent {}
