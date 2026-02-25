import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChTimelineItem {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  time?: string;
}

@Component({
  selector: 'ch-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-timeline"
      [class.ch-timeline--left]="mode === 'left'"
      [class.ch-timeline--right]="mode === 'right'"
      [class.ch-timeline--alternate]="mode === 'alternate'"
    >
      <div
        *ngFor="let item of displayItems; let i = index; let last = last"
        class="ch-timeline__item"
        [class.ch-timeline__item--left]="getAlignment(i) === 'left'"
        [class.ch-timeline__item--right]="getAlignment(i) === 'right'"
      >
        <div
          class="ch-timeline__content"
          [class.ch-timeline__content--left]="getAlignment(i) === 'left'"
          [class.ch-timeline__content--right]="getAlignment(i) === 'right'"
        >
          <span class="ch-timeline__label">{{ item.label }}</span>
          <span *ngIf="item.time" class="ch-timeline__time">{{ item.time }}</span>
          <p *ngIf="item.description" class="ch-timeline__description">
            {{ item.description }}
          </p>
        </div>

        <div class="ch-timeline__separator">
          <div
            class="ch-timeline__dot"
            [style.border-color]="item.color || null"
          >
            <span *ngIf="item.icon" class="ch-timeline__icon">{{ item.icon }}</span>
          </div>
          <div *ngIf="!last" class="ch-timeline__line"></div>
        </div>

        <div class="ch-timeline__opposite"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .ch-timeline {
        position: relative;
        padding: var(--ch-space-4, 1rem) 0;
      }

      /* -------------------------------------------------- *
       *  Item
       * -------------------------------------------------- */
      .ch-timeline__item {
        display: flex;
        flex-direction: row;
        position: relative;
        min-height: 60px;
      }

      /* -------------------------------------------------- *
       *  Separator (dot + line)
       * -------------------------------------------------- */
      .ch-timeline__separator {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        width: 20px;
      }

      .ch-timeline__dot {
        width: 10px;
        height: 10px;
        border-radius: var(--ch-radius-full, 9999px);
        border: 2px solid var(--ch-primary, #3b82f6);
        background: var(--ch-primary, #3b82f6);
        box-sizing: border-box;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }

      .ch-timeline__icon {
        font-size: 8px;
        line-height: 1;
        color: #fff;
      }

      .ch-timeline__line {
        width: 2px;
        flex: 1;
        background-color: var(--ch-border, #e5e7eb);
      }

      /* -------------------------------------------------- *
       *  Content
       * -------------------------------------------------- */
      .ch-timeline__content {
        flex: 1;
        padding: 0 var(--ch-space-3, 0.75rem) var(--ch-space-4, 1rem);
      }

      .ch-timeline__label {
        display: block;
        font-weight: 600;
        color: var(--ch-text, #111827);
        line-height: 1.25;
      }

      .ch-timeline__time {
        display: block;
        font-size: var(--ch-text-sm, 0.875rem);
        color: var(--ch-text-subtle, #6b7280);
        margin-top: var(--ch-space-1, 0.25rem);
      }

      .ch-timeline__description {
        margin: var(--ch-space-1, 0.25rem) 0 0;
        font-size: var(--ch-text-sm, 0.875rem);
        color: var(--ch-text-subtle, #6b7280);
        line-height: 1.5;
      }

      .ch-timeline__opposite {
        flex: 1;
      }

      /* -------------------------------------------------- *
       *  Left mode (default) – content on the right
       * -------------------------------------------------- */
      .ch-timeline--left .ch-timeline__item {
        flex-direction: row;
      }

      .ch-timeline--left .ch-timeline__opposite {
        display: none;
      }

      .ch-timeline--left .ch-timeline__content {
        order: 1;
      }

      .ch-timeline--left .ch-timeline__separator {
        order: 0;
      }

      /* -------------------------------------------------- *
       *  Right mode – content on the left
       * -------------------------------------------------- */
      .ch-timeline--right .ch-timeline__item {
        flex-direction: row-reverse;
      }

      .ch-timeline--right .ch-timeline__opposite {
        display: none;
      }

      .ch-timeline--right .ch-timeline__content {
        text-align: right;
        order: 1;
      }

      .ch-timeline--right .ch-timeline__separator {
        order: 0;
      }

      /* -------------------------------------------------- *
       *  Alternate mode
       * -------------------------------------------------- */
      .ch-timeline--alternate .ch-timeline__item {
        flex-direction: row;
      }

      .ch-timeline--alternate .ch-timeline__content {
        order: 0;
        text-align: right;
      }

      .ch-timeline--alternate .ch-timeline__separator {
        order: 1;
      }

      .ch-timeline--alternate .ch-timeline__opposite {
        order: 2;
      }

      /* Alternate: right-aligned items flip content to the right side */
      .ch-timeline--alternate .ch-timeline__item--right .ch-timeline__content {
        order: 2;
        text-align: left;
      }

      .ch-timeline--alternate .ch-timeline__item--right .ch-timeline__separator {
        order: 1;
      }

      .ch-timeline--alternate .ch-timeline__item--right .ch-timeline__opposite {
        order: 0;
      }
    `,
  ],
})
export class ChTimelineComponent {
  @Input() items: ChTimelineItem[] = [];
  @Input() mode: 'left' | 'right' | 'alternate' = 'left';
  @Input() reverse = false;

  get displayItems(): ChTimelineItem[] {
    return this.reverse ? [...this.items].reverse() : this.items;
  }

  getAlignment(index: number): 'left' | 'right' {
    if (this.mode === 'alternate') {
      return index % 2 === 0 ? 'left' : 'right';
    }
    return this.mode === 'right' ? 'right' : 'left';
  }
}
