import {
  Component, Input, ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string | any[];
  queryParams?: Record<string, any>;
  icon?: string;
}

@Component({
  selector: 'ch-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="ch-breadcrumb" aria-label="Breadcrumb">
      <ol class="ch-breadcrumb__list">
        <li *ngFor="let item of items; let last = last; let i = index"
          class="ch-breadcrumb__item"
          [class.ch-breadcrumb__item--current]="last">

          <!-- Link item -->
          <ng-container *ngIf="item.link && !last">
            <a class="ch-breadcrumb__link"
              [routerLink]="item.link"
              [queryParams]="item.queryParams">
              <span *ngIf="item.icon" class="ch-breadcrumb__icon" [innerHTML]="item.icon"></span>
              {{ item.label }}
            </a>
          </ng-container>

          <!-- Current page (last item) -->
          <ng-container *ngIf="last">
            <span class="ch-breadcrumb__current" aria-current="page">
              <span *ngIf="item.icon" class="ch-breadcrumb__icon" [innerHTML]="item.icon"></span>
              {{ item.label }}
            </span>
          </ng-container>

          <!-- Separator -->
          <span *ngIf="!last" class="ch-breadcrumb__separator" aria-hidden="true">
            <ng-container *ngIf="separator === 'chevron'">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </ng-container>
            <ng-container *ngIf="separator !== 'chevron'">{{ separator }}</ng-container>
          </span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .ch-breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--ch-space-1);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ch-breadcrumb__item {
      display: flex;
      align-items: center;
      gap: var(--ch-space-1);
    }

    .ch-breadcrumb__link {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-1);
      font-size: var(--ch-text-sm);
      color: var(--ch-text-muted);
      text-decoration: none;
      border-radius: var(--ch-radius-sm);
      padding: 1px 2px;
      transition: color var(--ch-transition-fast);

      &:hover { color: var(--ch-primary); text-decoration: underline; }
      &:focus-visible { outline: 2px solid var(--ch-primary); outline-offset: 2px; }
    }

    .ch-breadcrumb__current {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-1);
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      font-weight: var(--ch-weight-medium);
    }

    .ch-breadcrumb__separator {
      display: flex;
      align-items: center;
      color: var(--ch-text-muted);
      font-size: var(--ch-text-sm);
      svg { width: 0.875rem; height: 0.875rem; }
    }

    .ch-breadcrumb__icon {
      display: flex; align-items: center;
      svg, img { width: 0.875rem; height: 0.875rem; }
    }
  `],
})
export class ChBreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: 'chevron' | '/' | '>' | '•' = 'chevron';
}
