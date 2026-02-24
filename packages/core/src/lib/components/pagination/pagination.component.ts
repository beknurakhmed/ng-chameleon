import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  computed, signal, ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="ch-pagination" [class]="paginationClass()" aria-label="Pagination">
      <!-- Previous -->
      <button
        type="button"
        class="ch-pagination__btn ch-pagination__btn--nav"
        [disabled]="currentPage() === 1"
        [attr.aria-disabled]="currentPage() === 1"
        aria-label="Previous page"
        (click)="goTo(currentPage() - 1)">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- First page -->
      <button *ngIf="showFirst()"
        type="button"
        class="ch-pagination__btn"
        [class.ch-pagination__btn--active]="currentPage() === 1"
        [attr.aria-current]="currentPage() === 1 ? 'page' : null"
        (click)="goTo(1)">1</button>

      <!-- Ellipsis left -->
      <span *ngIf="showLeftEllipsis()" class="ch-pagination__ellipsis">…</span>

      <!-- Page numbers -->
      <button
        *ngFor="let p of pages()"
        type="button"
        class="ch-pagination__btn"
        [class.ch-pagination__btn--active]="p === currentPage()"
        [attr.aria-current]="p === currentPage() ? 'page' : null"
        [attr.aria-label]="'Page ' + p"
        (click)="goTo(p)">{{ p }}</button>

      <!-- Ellipsis right -->
      <span *ngIf="showRightEllipsis()" class="ch-pagination__ellipsis">…</span>

      <!-- Last page -->
      <button *ngIf="showLast()"
        type="button"
        class="ch-pagination__btn"
        [class.ch-pagination__btn--active]="currentPage() === totalPages()"
        [attr.aria-current]="currentPage() === totalPages() ? 'page' : null"
        (click)="goTo(totalPages())">{{ totalPages() }}</button>

      <!-- Next -->
      <button
        type="button"
        class="ch-pagination__btn ch-pagination__btn--nav"
        [disabled]="currentPage() === totalPages()"
        [attr.aria-disabled]="currentPage() === totalPages()"
        aria-label="Next page"
        (click)="goTo(currentPage() + 1)">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </nav>
  `,
  styles: [`
    .ch-pagination {
      display: inline-flex;
      align-items: center;
      gap: var(--ch-space-1);

      &--sm .ch-pagination__btn { width: 1.75rem; height: 1.75rem; font-size: var(--ch-text-xs); }
      &--lg .ch-pagination__btn { width: 2.75rem; height: 2.75rem; font-size: var(--ch-text-md); }
    }

    .ch-pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-md);
      background: var(--ch-bg);
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      cursor: pointer;
      transition: all var(--ch-transition-fast);
      user-select: none;

      svg { width: 1rem; height: 1rem; }

      &:hover:not(:disabled):not(.ch-pagination__btn--active) {
        background: var(--ch-bg-subtle);
        border-color: var(--ch-primary);
        color: var(--ch-primary);
      }

      &--active {
        background: var(--ch-primary);
        border-color: var(--ch-primary);
        color: white;
        cursor: default;
      }

      &--nav {
        color: var(--ch-text-muted);
        &:hover:not(:disabled) { color: var(--ch-primary); }
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &:focus-visible {
        outline: 2px solid var(--ch-primary);
        outline-offset: 2px;
      }
    }

    .ch-pagination__ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      font-size: var(--ch-text-sm);
      color: var(--ch-text-muted);
      user-select: none;
    }
  `],
})
export class ChPaginationComponent {
  @Input() set page(v: number) { this._page.set(v); }
  @Input() total   = 0;
  @Input() pageSize = 10;
  @Input() siblingCount = 1;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() pageChange = new EventEmitter<number>();

  private readonly _page = signal(1);
  readonly currentPage = this._page.asReadonly();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total / this.pageSize)));

  readonly paginationClass = computed(() =>
    this.size !== 'md' ? `ch-pagination--${this.size}` : ''
  );

  readonly pages = computed(() => {
    const total    = this.totalPages();
    const current  = this.currentPage();
    const siblings = this.siblingCount;

    const rangeStart = Math.max(2, current - siblings);
    const rangeEnd   = Math.min(total - 1, current + siblings);

    const arr: number[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) arr.push(i);
    return arr;
  });

  readonly showFirst          = computed(() => this.totalPages() > 1);
  readonly showLast           = computed(() => this.totalPages() > 1);
  readonly showLeftEllipsis   = computed(() => {
    const rangeStart = Math.max(2, this.currentPage() - this.siblingCount);
    return rangeStart > 2;
  });
  readonly showRightEllipsis  = computed(() => {
    const rangeEnd = Math.min(this.totalPages() - 1, this.currentPage() + this.siblingCount);
    return rangeEnd < this.totalPages() - 1;
  });

  goTo(page: number): void {
    const clamped = Math.min(Math.max(1, page), this.totalPages());
    if (clamped === this.currentPage()) return;
    this._page.set(clamped);
    this.pageChange.emit(clamped);
  }
}
