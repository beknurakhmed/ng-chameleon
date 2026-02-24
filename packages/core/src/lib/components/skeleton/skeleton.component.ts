import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgIf, NgStyle, NgFor } from '@angular/common';

/**
 * Skeleton — loading placeholder.
 *
 * @example
 * <!-- Single line -->
 * <ch-skeleton height="1rem" width="80%" />
 *
 * <!-- Text block -->
 * <ch-skeleton-text :noOfLines="3" spacing="2" />
 *
 * <!-- Circle avatar placeholder -->
 * <ch-skeleton height="3rem" width="3rem" borderRadius="full" />
 */
@Component({
  selector: 'ch-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"ch-skeleton" + (isLoaded ? " ch-skeleton--loaded" : "")',
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.border-radius]': 'resolvedRadius()',
    'aria-hidden': 'true',
  },
  template: `<ng-content/>`,
  styles: [`
    :host.ch-skeleton {
      display: block;
      background: linear-gradient(
        90deg,
        var(--ch-border) 25%,
        color-mix(in srgb, var(--ch-border) 60%, transparent) 50%,
        var(--ch-border) 75%
      );
      background-size: 200% 100%;
      animation: ch-pulse 1.5s ease-in-out infinite;
      border-radius: var(--ch-radius-md);
    }
    :host.ch-skeleton--loaded {
      animation: none;
      background: transparent;
    }
  `],
})
export class ChSkeletonComponent {
  @Input() height = '1rem';
  @Input() width  = '100%';
  @Input() borderRadius?: string;
  @Input() isLoaded = false;

  readonly resolvedRadius = computed(() => {
    if (!this.borderRadius) return undefined;
    const map: Record<string, string> = {
      sm:   'var(--ch-radius-sm)',
      md:   'var(--ch-radius-md)',
      lg:   'var(--ch-radius-lg)',
      full: 'var(--ch-radius-full)',
    };
    return map[this.borderRadius] ?? this.borderRadius;
  });
}

// ── Skeleton Text ──────────────────────────────────────────────────────────────

@Component({
  selector: 'ch-skeleton-text',
  standalone: true,
  imports: [NgFor, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [style.display]="'flex'" [style.flex-direction]="'column'" [style.gap]="spacing + 'px'">
      <ch-skeleton
        *ngFor="let line of lines(); let i = index; let last = last"
        height="0.875rem"
        [width]="last && lastLineWidth ? lastLineWidth : '100%'"
      />
    </div>
  `,
})
export class ChSkeletonTextComponent {
  @Input() noOfLines = 3;
  @Input() spacing = '8';
  @Input() lastLineWidth = '80%';
  @Input() isLoaded = false;

  readonly lines = computed(() => Array.from({ length: this.noOfLines }));
}
