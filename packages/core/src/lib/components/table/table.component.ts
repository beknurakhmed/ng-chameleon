import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TableSize    = 'sm' | 'md' | 'lg';
export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = Record<string, unknown>> {
  /** Property key on the data row object */
  key:       keyof T & string;
  /** Header label shown to the user */
  label:     string;
  sortable?: boolean;
  width?:    string;
  align?:    'left' | 'center' | 'right';
  /** Optional cell value formatter */
  format?:   (value: unknown, row: T) => string;
}

export interface TableSortEvent {
  column:    string;
  direction: SortDirection;
}

@Component({
  selector:         'ch-table',
  standalone:       true,
  imports:          [CommonModule],
  changeDetection:  ChangeDetectionStrategy.OnPush,
  encapsulation:    ViewEncapsulation.None,
  template: `
    <div class="ch-table-wrapper" [class.ch-table-wrapper--loading]="loading">

      <!-- Loading overlay -->
      @if (loading) {
        <div class="ch-table-overlay" aria-hidden="true">
          <div class="ch-table-spinner"></div>
        </div>
      }

      <div class="ch-table-scroll">
        <table
          class="ch-table"
          [class]="tableClasses()"
          [attr.aria-label]="caption || null"
          [attr.aria-busy]="loading || null"
          role="table"
        >
          @if (caption) {
            <caption class="ch-table__caption">{{ caption }}</caption>
          }

          <thead class="ch-table__head">
            <tr role="row">
              @for (col of columns; track col.key) {
                <th
                  class="ch-table__th"
                  [style.width]="col.width || null"
                  [style.textAlign]="col.align || 'left'"
                  [class.ch-table__th--sortable]="col.sortable"
                  [class.ch-table__th--sorted-asc]="col.sortable && sortColumn() === col.key && sortDirection() === 'asc'"
                  [class.ch-table__th--sorted-desc]="col.sortable && sortColumn() === col.key && sortDirection() === 'desc'"
                  [attr.aria-sort]="col.sortable ? ariaSort(col.key) : null"
                  scope="col"
                  (click)="col.sortable ? onSortClick(col.key) : null"
                  (keydown.enter)="col.sortable ? onSortClick(col.key) : null"
                  (keydown.space)="col.sortable ? onSortClick(col.key) : null"
                  [attr.tabindex]="col.sortable ? 0 : null"
                  role="columnheader"
                >
                  <span class="ch-table__th-inner">
                    {{ col.label }}
                    @if (col.sortable) {
                      <span class="ch-table__sort-icon" aria-hidden="true">
                        @if (sortColumn() === col.key && sortDirection() === 'asc') {
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 2l4 6H2z"/>
                          </svg>
                        } @else if (sortColumn() === col.key && sortDirection() === 'desc') {
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 10L2 4h8z"/>
                          </svg>
                        } @else {
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.4">
                            <path d="M6 1l3 4H3zm0 10L3 7h6z"/>
                          </svg>
                        }
                      </span>
                    }
                  </span>
                </th>
              }
            </tr>
          </thead>

          <tbody class="ch-table__body">
            @if (sortedData().length === 0 && !loading) {
              <tr role="row">
                <td
                  class="ch-table__empty"
                  [attr.colspan]="columns.length"
                  role="cell"
                >
                  <ng-content select="[chTableEmpty]"></ng-content>
                  @if (!_hasEmptySlot) {
                    <span>{{ emptyText }}</span>
                  }
                </td>
              </tr>
            }

            @for (row of sortedData(); track trackFn(row, $index)) {
              <tr
                class="ch-table__row"
                role="row"
                [class.ch-table__row--clickable]="rowClickable"
                (click)="rowClickable ? rowClick.emit(row) : null"
              >
                @for (col of columns; track col.key) {
                  <td
                    class="ch-table__td"
                    [style.textAlign]="col.align || 'left'"
                    role="cell"
                  >
                    {{ col.format ? col.format(getCellValue(row, col.key), row) : getCellValue(row, col.key) }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .ch-table-wrapper {
      position: relative;
      width: 100%;
    }
    .ch-table-wrapper--loading {
      pointer-events: none;
      opacity: 0.7;
    }
    .ch-table-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      background: rgba(255,255,255,0.5);
    }
    .ch-table-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--ch-border, #e2e8f0);
      border-top-color: var(--ch-primary, #4f46e5);
      border-radius: 50%;
      animation: ch-table-spin 0.7s linear infinite;
    }
    @keyframes ch-table-spin { to { transform: rotate(360deg); } }

    .ch-table-scroll { overflow-x: auto; }

    .ch-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
    }

    /* Size variants */
    .ch-table--sm .ch-table__th,
    .ch-table--sm .ch-table__td { padding: 0.375rem 0.75rem; }

    .ch-table--md .ch-table__th,
    .ch-table--md .ch-table__td { padding: 0.625rem 1rem; }

    .ch-table--lg .ch-table__th,
    .ch-table--lg .ch-table__td { padding: 0.875rem 1.25rem; }

    /* Header */
    .ch-table__head { background: var(--ch-bg-subtle, #f7fafc); }
    .ch-table__th {
      font-weight: 600;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--ch-text-subtle, #4a5568);
      border-bottom: 2px solid var(--ch-border, #e2e8f0);
      white-space: nowrap;
      user-select: none;
    }
    .ch-table__th-inner {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
    .ch-table__th--sortable {
      cursor: pointer;
    }
    .ch-table__th--sortable:hover {
      background: var(--ch-bg-elevated, #edf2f7);
      color: var(--ch-text, #1a202c);
    }
    .ch-table__th--sorted-asc,
    .ch-table__th--sorted-desc {
      color: var(--ch-primary, #4f46e5);
    }
    .ch-table__th--sortable:focus-visible {
      outline: 2px solid var(--ch-primary, #4f46e5);
      outline-offset: -2px;
    }

    /* Body */
    .ch-table__td {
      border-bottom: 1px solid var(--ch-border, #e2e8f0);
    }
    .ch-table__row:last-child .ch-table__td { border-bottom: none; }

    .ch-table__row--clickable { cursor: pointer; }
    .ch-table__row--clickable:hover .ch-table__td {
      background: var(--ch-bg-subtle, #f7fafc);
    }

    /* Striped */
    .ch-table--striped .ch-table__row:nth-child(even) .ch-table__td {
      background: var(--ch-bg-subtle, #f7fafc);
    }

    /* Bordered */
    .ch-table--bordered .ch-table__th,
    .ch-table--bordered .ch-table__td {
      border: 1px solid var(--ch-border, #e2e8f0);
    }

    /* Hover */
    .ch-table--hover .ch-table__row:hover .ch-table__td {
      background: var(--ch-bg-subtle, #f7fafc);
    }

    /* Caption */
    .ch-table__caption {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: var(--ch-text-subtle, #4a5568);
      caption-side: top;
      text-align: left;
    }

    /* Empty state */
    .ch-table__empty {
      text-align: center;
      padding: 2rem;
      color: var(--ch-text-muted, #a0aec0);
    }
  `],
})
export class ChTableComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements OnChanges {

  @Input() columns:      TableColumn<T>[] = [];
  @Input() data:         T[]              = [];
  @Input() size:         TableSize        = 'md';
  @Input() striped       = false;
  @Input() bordered      = false;
  @Input() hoverable     = false;
  @Input() loading       = false;
  @Input() caption?:     string;
  @Input() emptyText     = 'No data';
  @Input() rowClickable  = false;
  @Input() trackBy?:     (index: number, row: T) => unknown;

  @Output() sortChange  = new EventEmitter<TableSortEvent>();
  @Output() rowClick    = new EventEmitter<T>();

  readonly sortColumn    = signal<string | null>(null);
  readonly sortDirection = signal<SortDirection>(null);
  private  _data         = signal<T[]>([]);

  protected _hasEmptySlot = false; // set by ng-content presence check (future)

  readonly sortedData = computed<T[]>(() => {
    const col = this.sortColumn();
    const dir = this.sortDirection();
    const rows = [...this._data()];

    if (!col || !dir) return rows;

    return rows.sort((a, b) => {
      const av = a[col];
      const bv = b[col];

      if (av == null && bv == null) return 0;
      if (av == null) return dir === 'asc' ? -1 : 1;
      if (bv == null) return dir === 'asc' ? 1 : -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return dir === 'asc' ? av - bv : bv - av;
      }

      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return dir === 'asc'
        ? as.localeCompare(bs)
        : bs.localeCompare(as);
    });
  });

  readonly tableClasses = computed(() => {
    const cls = [`ch-table--${this.size}`];
    if (this.striped)   cls.push('ch-table--striped');
    if (this.bordered)  cls.push('ch-table--bordered');
    if (this.hoverable) cls.push('ch-table--hover');
    return cls.join(' ');
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this._data.set(this.data ?? []);
    }
  }

  onSortClick(key: string): void {
    const current = this.sortColumn();
    const dir     = this.sortDirection();

    if (current !== key) {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    } else if (dir === 'asc') {
      this.sortDirection.set('desc');
    } else if (dir === 'desc') {
      this.sortColumn.set(null);
      this.sortDirection.set(null);
    }

    this.sortChange.emit({
      column:    this.sortColumn() ?? key,
      direction: this.sortDirection(),
    });
  }

  ariaSort(key: string): string {
    if (this.sortColumn() !== key) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  getCellValue(row: T, key: string): unknown {
    return row[key as keyof T];
  }

  trackFn(row: T, index: number): unknown {
    return this.trackBy ? this.trackBy(index, row) : index;
  }
}
