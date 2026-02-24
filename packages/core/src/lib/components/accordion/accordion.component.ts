import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, ContentChildren, QueryList,
  AfterContentInit, OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

// ── Accordion Item ────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-accordion-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-accordion-item" [class.ch-accordion-item--expanded]="expanded()">
      <button
        type="button"
        class="ch-accordion-item__trigger"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="panelId"
        (click)="toggle()">
        <span class="ch-accordion-item__title">{{ title }}</span>
        <svg class="ch-accordion-item__icon" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div
        class="ch-accordion-item__panel"
        [id]="panelId"
        role="region"
        [attr.aria-labelledby]="triggerId"
        [style.display]="expanded() ? 'block' : 'none'">
        <div class="ch-accordion-item__content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ch-accordion-item {
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-md);
      overflow: hidden;

      & + & { margin-top: var(--ch-space-2); }

      &--expanded .ch-accordion-item__icon {
        transform: rotate(180deg);
      }
    }

    .ch-accordion-item__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--ch-space-4) var(--ch-space-4);
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background var(--ch-transition-fast);

      &:hover { background: var(--ch-bg-subtle); }
    }

    .ch-accordion-item__title {
      font-size: var(--ch-text-sm);
      font-weight: var(--ch-weight-medium);
      color: var(--ch-text);
    }

    .ch-accordion-item__icon {
      width: 1rem; height: 1rem;
      color: var(--ch-text-muted);
      flex-shrink: 0;
      transition: transform var(--ch-transition-fast);
    }

    .ch-accordion-item__panel {
      animation: ch-fade-in var(--ch-transition-fast) ease;
    }

    .ch-accordion-item__content {
      padding: 0 var(--ch-space-4) var(--ch-space-4);
      font-size: var(--ch-text-sm);
      color: var(--ch-text-subtle);
      line-height: var(--ch-leading-relaxed);
    }
  `],
})
export class ChAccordionItemComponent {
  @Input() title = '';
  @Output() toggled = new EventEmitter<boolean>();

  readonly panelId   = `ch-accordion-panel-${Math.random().toString(36).slice(2, 8)}`;
  readonly triggerId = `ch-accordion-trigger-${Math.random().toString(36).slice(2, 8)}`;

  private readonly _expanded = signal(false);
  readonly expanded = this._expanded.asReadonly();

  _setExpanded(v: boolean): void { this._expanded.set(v); }

  toggle(): void {
    const next = !this._expanded();
    this._expanded.set(next);
    this.toggled.emit(next);
  }
}

// ── Accordion Container ───────────────────────────────────────────────────────
@Component({
  selector: 'ch-accordion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-accordion">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.ch-accordion { width: 100%; }`],
})
export class ChAccordionComponent implements AfterContentInit, OnDestroy {
  @Input() allowMultiple = false;
  @Input() allowToggle   = true;

  @ContentChildren(ChAccordionItemComponent, { descendants: true })
  items!: QueryList<ChAccordionItemComponent>;

  private _subs: Subscription[] = [];

  ngAfterContentInit(): void {
    this._bindItems();
    this._subs.push(
      this.items.changes.subscribe(() => {
        this._subs.forEach(s => s.unsubscribe());
        this._subs = [];
        this._bindItems();
      })
    );
  }

  ngOnDestroy(): void { this._subs.forEach(s => s.unsubscribe()); }

  private _bindItems(): void {
    this.items.forEach(item => {
      const sub = item.toggled.subscribe((expanded: boolean) => {
        if (!this.allowMultiple && expanded) {
          this.items.forEach(other => {
            if (other !== item) other._setExpanded(false);
          });
        }
      });
      this._subs.push(sub);
    });
  }
}
