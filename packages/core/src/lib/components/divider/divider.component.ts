import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgIf } from '@angular/common';

/**
 * Divider — horizontal or vertical separator line.
 *
 * @example
 * <ch-divider />
 * <ch-divider orientation="vertical" />
 * <ch-divider label="OR" labelPosition="center" />
 */
@Component({
  selector: 'ch-divider',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"ch-divider ch-divider--" + orientation',
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation',
  },
  template: `
    <ng-container *ngIf="label; else noLabel">
      <span class="ch-divider-line"></span>
      <span class="ch-divider-label" [class]="'ch-divider-label--' + labelPosition">{{ label }}</span>
      <span class="ch-divider-line"></span>
    </ng-container>
    <ng-template #noLabel>
      <span class="ch-divider-line ch-divider-line--full"></span>
    </ng-template>
  `,
  styles: [`
    :host(.ch-divider--horizontal) {
      display: flex;
      align-items: center;
      width: 100%;
      gap: var(--ch-space-3);
    }
    :host(.ch-divider--vertical) {
      display: inline-flex;
      align-self: stretch;
      border-left: 1px solid var(--ch-border);
      height: auto;
    }

    .ch-divider-line {
      flex: 1;
      height: 1px;
      background: var(--ch-border);
    }
    .ch-divider-line--full { width: 100%; }

    .ch-divider-label {
      flex-shrink: 0;
      font-size: var(--ch-text-sm);
      color: var(--ch-text-muted);
      white-space: nowrap;
    }
  `],
})
export class ChDividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() label?: string;
  @Input() labelPosition: 'left' | 'center' | 'right' = 'center';
  @Input() variant: 'solid' | 'dashed' | 'dotted' = 'solid';
}
