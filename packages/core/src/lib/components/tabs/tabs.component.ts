import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, ContentChildren, QueryList,
  AfterContentInit, OnDestroy, Subscription,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabsVariant = 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';

// ── Tab Panel ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-tab-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div role="tabpanel" class="ch-tab-panel" [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .ch-tab-panel {
      padding-top: var(--ch-space-4);
      animation: ch-fade-in var(--ch-transition-fast) ease;
      &[hidden] { display: none; }
    }
  `],
})
export class ChTabPanelComponent {
  @Input() label = '';
  @Input() disabled = false;
  active = false;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-tabs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-tabs" [class]="tabsClass()">
      <!-- Tab list -->
      <div role="tablist" class="ch-tabs__list" [class]="listClass()">
        <button
          *ngFor="let panel of panels; let i = index"
          role="tab"
          type="button"
          class="ch-tabs__tab"
          [class.ch-tabs__tab--active]="activeIndex() === i"
          [class.ch-tabs__tab--disabled]="panel.disabled"
          [attr.aria-selected]="activeIndex() === i"
          [attr.aria-disabled]="panel.disabled || null"
          [attr.tabindex]="activeIndex() === i ? 0 : -1"
          (click)="selectTab(i)"
          (keydown)="onKeydown($event, i)">
          {{ panel.label }}
        </button>
      </div>

      <!-- Tab panels -->
      <div class="ch-tabs__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ch-tabs { width: 100%; }

    .ch-tabs__list {
      display: flex;
      position: relative;

      &--line {
        border-bottom: 2px solid var(--ch-border);
        gap: 0;
      }
      &--enclosed {
        border: 1px solid var(--ch-border);
        border-radius: var(--ch-radius-md) var(--ch-radius-md) 0 0;
        background: var(--ch-bg-subtle);
        gap: 0;
      }
      &--soft-rounded, &--solid-rounded {
        background: var(--ch-bg-subtle);
        border-radius: var(--ch-radius-lg);
        padding: var(--ch-space-1);
        gap: var(--ch-space-1);
      }
    }

    .ch-tabs__tab {
      position: relative;
      padding: var(--ch-space-2) var(--ch-space-4);
      border: none;
      background: transparent;
      font-size: var(--ch-text-sm);
      font-weight: var(--ch-weight-medium);
      color: var(--ch-text-muted);
      cursor: pointer;
      transition: all var(--ch-transition-fast);
      white-space: nowrap;
      border-radius: 0;

      &:hover:not(.ch-tabs__tab--disabled) { color: var(--ch-primary); }
      &--disabled { opacity: 0.4; cursor: not-allowed; }

      /* line variant */
      .ch-tabs__list--line & {
        margin-bottom: -2px;
        &.ch-tabs__tab--active {
          color: var(--ch-primary);
          border-bottom: 2px solid var(--ch-primary);
        }
      }

      /* enclosed variant */
      .ch-tabs__list--enclosed & {
        border: 1px solid transparent;
        border-bottom: none;
        margin-bottom: -1px;
        &.ch-tabs__tab--active {
          background: var(--ch-bg);
          border-color: var(--ch-border);
          border-bottom-color: var(--ch-bg);
          color: var(--ch-text);
        }
      }

      /* soft-rounded variant */
      .ch-tabs__list--soft-rounded & {
        border-radius: var(--ch-radius-md);
        &.ch-tabs__tab--active {
          background: var(--ch-bg);
          color: var(--ch-primary);
          box-shadow: var(--ch-shadow-sm);
        }
      }

      /* solid-rounded variant */
      .ch-tabs__list--solid-rounded & {
        border-radius: var(--ch-radius-md);
        &.ch-tabs__tab--active {
          background: var(--ch-primary);
          color: white;
        }
      }

      &:focus-visible {
        outline: 2px solid var(--ch-primary);
        outline-offset: 2px;
        border-radius: var(--ch-radius-sm);
      }
    }

    .ch-tabs__content { width: 100%; }
  `],
})
export class ChTabsComponent implements AfterContentInit, OnDestroy {
  @Input() variant: TabsVariant = 'line';
  @Input() set selectedIndex(v: number) { this.activeIndex.set(v); }

  @Output() tabChange = new EventEmitter<number>();

  @ContentChildren(ChTabPanelComponent) panels!: QueryList<ChTabPanelComponent>;

  readonly activeIndex = signal(0);
  private _sub?: Subscription;

  readonly tabsClass  = computed(() => `ch-tabs--${this.variant}`);
  readonly listClass  = computed(() => `ch-tabs__list--${this.variant}`);

  ngAfterContentInit(): void {
    this._syncPanels();
    this._sub = this.panels.changes.subscribe(() => this._syncPanels());
  }

  ngOnDestroy(): void { this._sub?.unsubscribe(); }

  selectTab(i: number): void {
    const panel = this.panels.get(i);
    if (!panel || panel.disabled) return;
    this.activeIndex.set(i);
    this._syncPanels();
    this.tabChange.emit(i);
  }

  onKeydown(e: KeyboardEvent, i: number): void {
    const total = this.panels.length;
    if (e.key === 'ArrowRight') this.selectTab((i + 1) % total);
    if (e.key === 'ArrowLeft')  this.selectTab((i - 1 + total) % total);
    if (e.key === 'Home')       this.selectTab(0);
    if (e.key === 'End')        this.selectTab(total - 1);
  }

  private _syncPanels(): void {
    this.panels.forEach((p, i) => { p.active = i === this.activeIndex(); });
  }
}
