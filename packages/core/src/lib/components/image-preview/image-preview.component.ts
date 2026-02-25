import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-image',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-image"
      [style.width]="normalizedWidth()"
      [style.height]="normalizedHeight()"
    >
      <!-- Loading placeholder -->
      @if (loading() && placeholder()) {
        <div class="ch-image__placeholder">
          <div class="ch-image__placeholder-pulse"></div>
        </div>
      }

      <!-- Error state -->
      @if (error() && !fallback()) {
        <div class="ch-image__error">
          <svg
            class="ch-image__error-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        </div>
      }

      <!-- Fallback image on error -->
      @if (error() && fallback()) {
        <img
          class="ch-image__img"
          [src]="fallback()"
          [alt]="alt()"
          [style.object-fit]="fit()"
        />
      }

      <!-- Main image -->
      <img
        class="ch-image__img"
        [class.ch-image__img--hidden]="error() || loading()"
        [src]="src()"
        [alt]="alt()"
        [style.object-fit]="fit()"
        (load)="onImageLoad()"
        (error)="onImageError()"
        (click)="onImageClick()"
      />

      <!-- Fullscreen preview overlay -->
      @if (previewOpen()) {
        <div
          class="ch-image__overlay"
          (click)="closePreview()"
        >
          <button
            class="ch-image__overlay-close"
            (click)="closePreview(); $event.stopPropagation()"
            aria-label="Close preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <img
            class="ch-image__overlay-img"
            [src]="previewImageSrc()"
            [alt]="alt()"
            [style.transform]="scaleTransform()"
            (click)="$event.stopPropagation()"
          />

          <div
            class="ch-image__overlay-controls"
            (click)="$event.stopPropagation()"
          >
            <button
              class="ch-image__overlay-btn"
              (click)="zoomOut()"
              [disabled]="scale() <= 0.5"
              aria-label="Zoom out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            <span class="ch-image__overlay-scale">
              {{ scalePercent() }}%
            </span>

            <button
              class="ch-image__overlay-btn"
              (click)="zoomIn()"
              [disabled]="scale() >= 3"
              aria-label="Zoom in"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :root {
        --ch-image-radius: var(--ch-radius-md, 8px);
        --ch-image-placeholder-bg: var(--ch-bg-subtle, #e5e7eb);
        --ch-image-placeholder-shine: var(--ch-bg-muted, #f3f4f6);
        --ch-image-error-bg: var(--ch-bg-subtle, #f3f4f6);
        --ch-image-error-color: var(--ch-text-muted, #9ca3af);
        --ch-image-overlay-bg: rgba(0, 0, 0, 0.7);
        --ch-image-overlay-z: var(--ch-z-modal, 1000);
        --ch-image-controls-bg: rgba(0, 0, 0, 0.5);
        --ch-image-controls-color: #ffffff;
        --ch-image-controls-radius: var(--ch-radius-lg, 12px);
      }

      .ch-image {
        position: relative;
        overflow: hidden;
        display: inline-block;
        border-radius: var(--ch-image-radius);
        line-height: 0;
      }

      .ch-image__img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: var(--ch-image-radius);
        transition: opacity 0.3s ease;
      }

      .ch-image__img--hidden {
        opacity: 0;
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .ch-image__img:not(.ch-image__img--hidden) {
        cursor: pointer;
      }

      /* Placeholder / skeleton */
      .ch-image__placeholder {
        position: absolute;
        inset: 0;
        background: var(--ch-image-placeholder-bg);
        border-radius: var(--ch-image-radius);
        overflow: hidden;
      }

      .ch-image__placeholder-pulse {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--ch-image-placeholder-shine) 50%,
          transparent 100%
        );
        animation: ch-image-pulse 1.5s ease-in-out infinite;
      }

      @keyframes ch-image-pulse {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      /* Error state */
      .ch-image__error {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ch-image-error-bg);
        border-radius: var(--ch-image-radius);
        color: var(--ch-image-error-color);
      }

      .ch-image__error-icon {
        width: 48px;
        height: 48px;
        opacity: 0.6;
      }

      /* Preview overlay */
      .ch-image__overlay {
        position: fixed;
        inset: 0;
        z-index: var(--ch-image-overlay-z);
        background: var(--ch-image-overlay-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        animation: ch-image-overlay-in 0.2s ease-out;
      }

      @keyframes ch-image-overlay-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .ch-image__overlay-img {
        max-width: 90vw;
        max-height: 85vh;
        object-fit: contain;
        border-radius: var(--ch-image-radius);
        cursor: default;
        transition: transform 0.25s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      }

      .ch-image__overlay-close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: var(--ch-image-controls-bg);
        color: var(--ch-image-controls-color);
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .ch-image__overlay-close:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      .ch-image__overlay-controls {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--ch-image-controls-bg);
        border-radius: var(--ch-image-controls-radius);
        padding: 8px 16px;
        color: var(--ch-image-controls-color);
      }

      .ch-image__overlay-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--ch-image-controls-color);
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .ch-image__overlay-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
      }

      .ch-image__overlay-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .ch-image__overlay-scale {
        font-size: 14px;
        font-weight: 500;
        min-width: 48px;
        text-align: center;
        user-select: none;
      }
    `,
  ],
})
export class ImagePreviewComponent {
  // ---------------------------------------------------------------------------
  // Inputs (signal-based)
  // ---------------------------------------------------------------------------

  /** Image source URL. */
  readonly src = input.required<string>();

  /** Image alt text. */
  readonly alt = input<string>('');

  /** Explicit width for the wrapper (px if number, raw string otherwise). */
  readonly width = input<string | number | undefined>(undefined);

  /** Explicit height for the wrapper (px if number, raw string otherwise). */
  readonly height = input<string | number | undefined>(undefined);

  /** Fallback image URL shown when the primary source fails to load. */
  readonly fallback = input<string>('');

  /** Whether clicking the image opens a fullscreen preview. */
  readonly preview = input<boolean>(true);

  /** Higher-resolution source used inside the preview overlay. */
  readonly previewSrc = input<string>('');

  /** CSS object-fit value for the main image. */
  readonly fit = input<'contain' | 'cover' | 'fill' | 'none'>('cover');

  /** Whether to display a skeleton placeholder while loading. */
  readonly placeholder = input<boolean>(true);

  // ---------------------------------------------------------------------------
  // State signals
  // ---------------------------------------------------------------------------

  /** True while the image is still loading. */
  readonly loading = signal<boolean>(true);

  /** True if the image failed to load. */
  readonly error = signal<boolean>(false);

  /** True when the fullscreen preview overlay is open. */
  readonly previewOpen = signal<boolean>(false);

  /** Current zoom scale inside the preview overlay. */
  readonly scale = signal<number>(1);

  // ---------------------------------------------------------------------------
  // Computed helpers
  // ---------------------------------------------------------------------------

  /** Normalise width input to a CSS-compatible string. */
  protected readonly normalizedWidth = computed(() => {
    const w = this.width();
    if (w === undefined || w === null) return null;
    return typeof w === 'number' ? `${w}px` : w;
  });

  /** Normalise height input to a CSS-compatible string. */
  protected readonly normalizedHeight = computed(() => {
    const h = this.height();
    if (h === undefined || h === null) return null;
    return typeof h === 'number' ? `${h}px` : h;
  });

  /** Resolve which source the preview overlay should display. */
  protected readonly previewImageSrc = computed(() => {
    const highRes = this.previewSrc();
    return highRes ? highRes : this.src();
  });

  /** CSS transform string for the preview image zoom. */
  protected readonly scaleTransform = computed(() => {
    return `scale(${this.scale()})`;
  });

  /** Rounded scale percentage for display. */
  protected readonly scalePercent = computed(() => {
    return Math.round(this.scale() * 100);
  });

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  /** Called when the native <img> fires its load event. */
  onImageLoad(): void {
    this.loading.set(false);
    this.error.set(false);
  }

  /** Called when the native <img> fires its error event. */
  onImageError(): void {
    this.loading.set(false);
    this.error.set(true);
  }

  /** Opens the preview overlay (if the feature is enabled). */
  onImageClick(): void {
    if (this.preview() && !this.error()) {
      this.scale.set(1);
      this.previewOpen.set(true);
    }
  }

  /** Closes the preview overlay. */
  closePreview(): void {
    this.previewOpen.set(false);
  }

  /** Increase zoom by 25%, capping at 300%. */
  zoomIn(): void {
    this.scale.update((s) => Math.min(s + 0.25, 3));
  }

  /** Decrease zoom by 25%, flooring at 50%. */
  zoomOut(): void {
    this.scale.update((s) => Math.max(s - 0.25, 0.5));
  }

  /** Close the overlay when the user presses Escape. */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.previewOpen()) {
      this.closePreview();
    }
  }
}
