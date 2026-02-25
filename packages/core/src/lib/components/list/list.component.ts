import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-list-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-list-item"
      [class.ch-list-item--has-avatar]="avatar"
      [class.ch-list-item--has-extra]="extra"
    >
      <img
        *ngIf="avatar"
        class="ch-list-item__avatar"
        [src]="avatar"
        alt=""
      />
      <div class="ch-list-item__content">
        <div class="ch-list-item__title">
          <ng-content></ng-content>
        </div>
        <div *ngIf="description" class="ch-list-item__description">
          {{ description }}
        </div>
      </div>
      <div *ngIf="extra" class="ch-list-item__extra">
        {{ extra }}
      </div>
    </div>
  `,
  styles: [
    `
      .ch-list-item {
        display: flex;
        align-items: center;
        gap: var(--ch-space-3, 0.75rem);
        padding: var(--ch-space-3, 0.75rem) var(--ch-space-4, 1rem);
        border-bottom: 1px solid var(--ch-border, #e2e8f0);
        transition: background-color 0.15s ease;
      }

      .ch-list-item:last-child {
        border-bottom: none;
      }

      .ch-list-item__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .ch-list-item__content {
        display: flex;
        flex-direction: column;
        gap: var(--ch-space-1, 0.25rem);
        min-width: 0;
        flex: 1;
      }

      .ch-list-item__title {
        font-size: var(--ch-font-size-base, 0.875rem);
        color: var(--ch-text, #1a202c);
        line-height: 1.5;
      }

      .ch-list-item__description {
        font-size: var(--ch-font-size-sm, 0.75rem);
        color: var(--ch-text-muted, #718096);
        line-height: 1.4;
      }

      .ch-list-item__extra {
        margin-left: auto;
        flex-shrink: 0;
        font-size: var(--ch-font-size-sm, 0.75rem);
        color: var(--ch-text-subtle, #a0aec0);
        white-space: nowrap;
      }
    `,
  ],
})
export class ChListItemComponent {
  @Input() avatar: string = '';
  @Input() description: string = '';
  @Input() extra: string = '';
}

@Component({
  selector: 'ch-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-list"
      [class.ch-list--bordered]="bordered"
      [class.ch-list--sm]="size === 'sm'"
      [class.ch-list--md]="size === 'md'"
      [class.ch-list--lg]="size === 'lg'"
      [class.ch-list--loading]="loading"
    >
      <div *ngIf="header" class="ch-list__header">
        {{ header }}
      </div>

      <ng-container *ngIf="!loading; else skeletonTpl">
        <ng-content></ng-content>
      </ng-container>

      <ng-template #skeletonTpl>
        <div
          *ngFor="let item of skeletonItems"
          class="ch-list-item ch-list-item--skeleton"
        >
          <div class="ch-list-item__skeleton-avatar"></div>
          <div class="ch-list-item__skeleton-content">
            <div class="ch-list-item__skeleton-title"></div>
            <div class="ch-list-item__skeleton-description"></div>
          </div>
        </div>
      </ng-template>

      <div *ngIf="footer" class="ch-list__footer">
        {{ footer }}
      </div>
    </div>
  `,
  styles: [
    `
      .ch-list {
        width: 100%;
        font-family: var(--ch-font-family, inherit);
      }

      .ch-list--bordered {
        border: 1px solid var(--ch-border, #e2e8f0);
        border-radius: var(--ch-radius-md, 0.5rem);
        overflow: hidden;
      }

      .ch-list__header,
      .ch-list__footer {
        padding: var(--ch-space-3, 0.75rem) var(--ch-space-4, 1rem);
        background: var(--ch-bg-subtle, #f7fafc);
        font-weight: 600;
        font-size: var(--ch-font-size-sm, 0.875rem);
        color: var(--ch-text, #1a202c);
      }

      .ch-list__header {
        border-bottom: 1px solid var(--ch-border, #e2e8f0);
      }

      .ch-list__footer {
        border-top: 1px solid var(--ch-border, #e2e8f0);
      }

      /* Size: sm */
      .ch-list--sm .ch-list-item {
        padding: var(--ch-space-2, 0.5rem) var(--ch-space-3, 0.75rem);
        font-size: var(--ch-font-size-sm, 0.75rem);
      }

      .ch-list--sm .ch-list-item__avatar {
        width: 32px;
        height: 32px;
      }

      .ch-list--sm .ch-list-item__title {
        font-size: var(--ch-font-size-sm, 0.75rem);
      }

      .ch-list--sm .ch-list-item__description {
        font-size: var(--ch-font-size-xs, 0.625rem);
      }

      .ch-list--sm .ch-list__header,
      .ch-list--sm .ch-list__footer {
        padding: var(--ch-space-2, 0.5rem) var(--ch-space-3, 0.75rem);
        font-size: var(--ch-font-size-xs, 0.75rem);
      }

      /* Size: md (default) */
      .ch-list--md .ch-list-item {
        padding: var(--ch-space-3, 0.75rem) var(--ch-space-4, 1rem);
      }

      .ch-list--md .ch-list-item__avatar {
        width: 40px;
        height: 40px;
      }

      /* Size: lg */
      .ch-list--lg .ch-list-item {
        padding: var(--ch-space-4, 1rem) var(--ch-space-5, 1.25rem);
        font-size: var(--ch-font-size-lg, 1.125rem);
      }

      .ch-list--lg .ch-list-item__avatar {
        width: 48px;
        height: 48px;
      }

      .ch-list--lg .ch-list-item__title {
        font-size: var(--ch-font-size-lg, 1.125rem);
      }

      .ch-list--lg .ch-list-item__description {
        font-size: var(--ch-font-size-base, 0.875rem);
      }

      .ch-list--lg .ch-list__header,
      .ch-list--lg .ch-list__footer {
        padding: var(--ch-space-4, 1rem) var(--ch-space-5, 1.25rem);
        font-size: var(--ch-font-size-base, 1rem);
      }

      /* Skeleton loading */
      @keyframes ch-skeleton-pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 1;
        }
      }

      .ch-list-item--skeleton {
        display: flex;
        align-items: center;
        gap: var(--ch-space-3, 0.75rem);
        pointer-events: none;
      }

      .ch-list-item__skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--ch-bg-subtle, #e2e8f0);
        flex-shrink: 0;
        animation: ch-skeleton-pulse 1.5s ease-in-out infinite;
      }

      .ch-list-item__skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--ch-space-2, 0.5rem);
      }

      .ch-list-item__skeleton-title {
        height: 14px;
        width: 60%;
        background: var(--ch-bg-subtle, #e2e8f0);
        border-radius: var(--ch-radius-sm, 0.25rem);
        animation: ch-skeleton-pulse 1.5s ease-in-out 0.1s infinite;
      }

      .ch-list-item__skeleton-description {
        height: 10px;
        width: 40%;
        background: var(--ch-bg-subtle, #e2e8f0);
        border-radius: var(--ch-radius-sm, 0.25rem);
        animation: ch-skeleton-pulse 1.5s ease-in-out 0.2s infinite;
      }

      .ch-list--sm .ch-list-item__skeleton-avatar {
        width: 32px;
        height: 32px;
      }

      .ch-list--lg .ch-list-item__skeleton-avatar {
        width: 48px;
        height: 48px;
      }

      .ch-list--lg .ch-list-item__skeleton-title {
        height: 18px;
      }

      .ch-list--lg .ch-list-item__skeleton-description {
        height: 14px;
      }
    `,
  ],
})
export class ChListComponent {
  @Input() bordered: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading: boolean = false;
  @Input() header: string = '';
  @Input() footer: string = '';

  readonly skeletonItems = [0, 1, 2];
}
