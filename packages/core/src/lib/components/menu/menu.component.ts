import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, ContentChildren, QueryList,
  AfterContentInit, OnDestroy, ElementRef, HostListener,
  Directive, TemplateRef, ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MenuTrigger = 'click' | 'hover' | 'context';
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';

@Directive({
  selector: 'ch-menu-item',
  standalone: true,
  host: { class: 'ch-menu-item-host' },
})
export class ChMenuItemDirective {
  @Input() label     = '';
  @Input() icon?:    string;    // SVG string or icon class
  @Input() disabled  = false;
  @Input() danger    = false;
  @Input() shortcut?: string;

  @Output() itemClick = new EventEmitter<void>();
}

@Component({
  selector: 'ch-menu-divider',
  standalone: true,
  template: `<div class="ch-menu-divider" role="separator"></div>`,
  styles: [`.ch-menu-divider { height: 1px; background: var(--ch-border, #e2e8f0); margin: 0.25rem 0; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChMenuDividerComponent {}

@Component({
  selector: 'ch-menu-group',
  standalone: true,
  template: `
    <div class="ch-menu-group">
      @if (label) {
        <p class="ch-menu-group__label">{{ label }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .ch-menu-group__label {
      padding: 0.375rem 0.75rem 0.125rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ch-text-muted, #a0aec0);
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChMenuGroupComponent {
  @Input() label = '';
}

@Component({
  selector: 'ch-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-menu-host"
      [class.ch-menu-host--open]="isOpen()"
      (mouseenter)="trigger === 'hover' ? open() : null"
      (mouseleave)="trigger === 'hover' ? close() : null"
      (contextmenu)="trigger === 'context' ? onContextMenu($event) : null"
    >
      <!-- Trigger slot -->
      <div
        class="ch-menu__trigger"
        (click)="trigger === 'click' ? toggle() : null"
        [attr.aria-haspopup]="'menu'"
        [attr.aria-expanded]="isOpen()"
      >
        <ng-content select="[chMenuTrigger]"></ng-content>
      </div>

      <!-- Menu panel -->
      @if (isOpen()) {
        <div
          class="ch-menu__panel"
          [class]="panelClasses()"
          role="menu"
          [attr.aria-label]="ariaLabel || null"
          (keydown)="onKeyDown($event)"
        >
          <ng-content></ng-content>

          <!-- Rendered items (if using items input) -->
          @for (item of items; track item.label) {
            @if (item.divider) {
              <div class="ch-menu-divider" role="separator"></div>
            } @else if (item.group) {
              <p class="ch-menu-group__label">{{ item.group }}</p>
            } @else {
              <button
                type="button"
                class="ch-menu__item"
                [class.ch-menu__item--danger]="item.danger"
                [class.ch-menu__item--active]="focusedIndex() === $index"
                [disabled]="item.disabled"
                role="menuitem"
                (click)="onItemClick(item)"
                (mouseenter)="focusedIndex.set($index)"
              >
                @if (item.icon) {
                  <span class="ch-menu__item-icon" [innerHTML]="item.icon" aria-hidden="true"></span>
                }
                <span class="ch-menu__item-label">{{ item.label }}</span>
                @if (item.shortcut) {
                  <kbd class="ch-menu__item-shortcut">{{ item.shortcut }}</kbd>
                }
                @if (item.children?.length) {
                  <svg class="ch-menu__item-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 2l4 4-4 4"/>
                  </svg>
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-menu-host {
      position: relative;
      display: inline-block;
    }

    .ch-menu__trigger { display: inline-flex; }

    /* Panel */
    .ch-menu__panel {
      position: absolute;
      z-index: 300;
      min-width: 160px;
      padding: 0.25rem;
      background: var(--ch-bg, #fff);
      border: 1.5px solid var(--ch-border, #e2e8f0);
      border-radius: var(--ch-radius-md, 0.5rem);
      box-shadow: var(--ch-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
      animation: ch-menu-in 0.1s ease;
      outline: none;
    }
    @keyframes ch-menu-in {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to   { opacity: 1; transform: scale(1)    translateY(0); }
    }

    /* Placements */
    .ch-menu__panel--bottom-start { top: calc(100% + 4px); left: 0; }
    .ch-menu__panel--bottom-end   { top: calc(100% + 4px); right: 0; }
    .ch-menu__panel--top-start    { bottom: calc(100% + 4px); left: 0; }
    .ch-menu__panel--top-end      { bottom: calc(100% + 4px); right: 0; }
    .ch-menu__panel--right-start  { left: calc(100% + 4px); top: 0; }
    .ch-menu__panel--left-start   { right: calc(100% + 4px); top: 0; }

    /* Items */
    .ch-menu__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.4375rem 0.75rem;
      border: none;
      background: none;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
      text-align: left;
      transition: background 0.1s;
      white-space: nowrap;
    }
    .ch-menu__item:hover:not(:disabled),
    .ch-menu__item--active:not(:disabled) {
      background: var(--ch-bg-subtle, #f7fafc);
      color: var(--ch-text, #1a202c);
    }
    .ch-menu__item--danger { color: var(--ch-error, #e53e3e); }
    .ch-menu__item--danger:hover:not(:disabled),
    .ch-menu__item--danger.ch-menu__item--active:not(:disabled) {
      background: color-mix(in srgb, var(--ch-error, #e53e3e) 10%, transparent);
    }
    .ch-menu__item:disabled { opacity: 0.4; cursor: not-allowed; }
    .ch-menu__item:focus-visible { outline: 2px solid var(--ch-primary, #4f46e5); outline-offset: -1px; }

    .ch-menu__item-icon { display: flex; align-items: center; width: 16px; height: 16px; flex-shrink: 0; }
    .ch-menu__item-label { flex: 1; }
    .ch-menu__item-shortcut {
      font-family: monospace;
      font-size: 0.6875rem;
      color: var(--ch-text-muted, #a0aec0);
      background: var(--ch-bg-subtle, #f7fafc);
      border: 1px solid var(--ch-border, #e2e8f0);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .ch-menu__item-arrow { color: var(--ch-text-muted, #a0aec0); margin-left: auto; }
  `],
})
export class ChMenuComponent implements AfterContentInit, OnDestroy {

  @Input() trigger:    MenuTrigger   = 'click';
  @Input() placement:  MenuPlacement = 'bottom-start';
  @Input() ariaLabel?: string;
  /** Use for simple programmatic item lists */
  @Input() items:      MenuItem[]    = [];

  @Output() itemClick = new EventEmitter<MenuItem>();
  @Output() opened    = new EventEmitter<void>();
  @Output() closed    = new EventEmitter<void>();

  readonly isOpen      = signal(false);
  readonly focusedIndex = signal(-1);

  private _hoverTimer?: ReturnType<typeof setTimeout>;

  readonly panelClasses = computed(() =>
    `ch-menu__panel--${this.placement}`
  );

  ngAfterContentInit(): void {}
  ngOnDestroy(): void { clearTimeout(this._hoverTimer); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  constructor(private el: ElementRef) {}

  open():   void { this.isOpen.set(true);  this.focusedIndex.set(-1); this.opened.emit(); }
  close():  void { this.isOpen.set(false); this.closed.emit(); }
  toggle(): void { this.isOpen() ? this.close() : this.open(); }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.toggle();
  }

  onItemClick(item: MenuItem): void {
    if (item.disabled) return;
    item.action?.();
    this.itemClick.emit(item);
    if (!item.children?.length) this.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    const visibleItems = this.items.filter(i => !i.divider && !i.group && !i.disabled);
    if (!visibleItems.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex.update(i => Math.min(i + 1, visibleItems.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.update(i => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' || event.key === ' ') {
      const idx = this.focusedIndex();
      if (idx >= 0) this.onItemClick(visibleItems[idx]);
    } else if (event.key === 'Home') {
      this.focusedIndex.set(0);
    } else if (event.key === 'End') {
      this.focusedIndex.set(visibleItems.length - 1);
    }
  }
}

export interface MenuItem {
  label?:     string;
  icon?:      string;
  disabled?:  boolean;
  danger?:    boolean;
  shortcut?:  string;
  divider?:   boolean;
  group?:     string;
  action?:    () => void;
  children?:  MenuItem[];
}
