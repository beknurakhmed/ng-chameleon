import {
  Component, Directive, Input, Output, EventEmitter,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
  ElementRef, inject, HostListener, OnDestroy, Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ── Dropdown Item ─────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      class="ch-dropdown-item"
      [class.ch-dropdown-item--danger]="isDanger"
      [disabled]="disabled"
      (click)="itemClick.emit($event)">
      <span *ngIf="icon" class="ch-dropdown-item__icon" [innerHTML]="icon"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .ch-dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--ch-space-2);
      width: 100%;
      padding: var(--ch-space-2) var(--ch-space-3);
      background: transparent;
      border: none;
      border-radius: var(--ch-radius-md);
      font-size: var(--ch-text-sm);
      color: var(--ch-text);
      cursor: pointer;
      text-align: left;
      transition: all var(--ch-transition-fast);

      &:hover:not(:disabled) { background: var(--ch-bg-subtle); }
      &--danger { color: var(--ch-error); &:hover:not(:disabled) { background: var(--ch-error-subtle, rgba(239,68,68,0.08)); } }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .ch-dropdown-item__icon {
      display: flex; align-items: center; justify-content: center;
      width: 1rem; height: 1rem; flex-shrink: 0;
      svg, img { width: 100%; height: 100%; }
    }
  `],
})
export class ChDropdownItemComponent {
  @Input() icon?: string;
  @Input() isDanger = false;
  @Input() disabled = false;
  @Output() itemClick = new EventEmitter<MouseEvent>();
}

// ── Dropdown Divider ──────────────────────────────────────────────────────────
@Component({
  selector: 'ch-dropdown-divider',
  standalone: true,
  template: `<div class="ch-dropdown-divider"></div>`,
  styles: [`.ch-dropdown-divider { height: 1px; background: var(--ch-border); margin: var(--ch-space-1) 0; }`],
})
export class ChDropdownDividerComponent {}

// ── Dropdown Menu ─────────────────────────────────────────────────────────────
@Component({
  selector: 'ch-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-dropdown" #dropdownRef>
      <!-- Trigger -->
      <ng-content select="[chDropdownTrigger]"></ng-content>

      <!-- Menu panel -->
      <div *ngIf="isOpen()"
        class="ch-dropdown__menu"
        [class]="menuClass()"
        role="menu">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ch-dropdown { position: relative; display: inline-flex; }

    .ch-dropdown__menu {
      position: absolute;
      z-index: var(--ch-z-dropdown, 1000);
      min-width: 10rem;
      padding: var(--ch-space-1);
      background: var(--ch-bg);
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-lg);
      box-shadow: var(--ch-shadow-lg);
      animation: ch-fade-in var(--ch-transition-fast) ease;

      &--bottom-start { top: calc(100% + 4px); left: 0; }
      &--bottom-end   { top: calc(100% + 4px); right: 0; }
      &--top-start    { bottom: calc(100% + 4px); left: 0; }
      &--top-end      { bottom: calc(100% + 4px); right: 0; }
    }
  `],
})
export class ChDropdownMenuComponent implements OnDestroy {
  @Input() placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';

  @Output() opened  = new EventEmitter<void>();
  @Output() closedEvent = new EventEmitter<void>();

  readonly isOpen = signal(false);
  readonly menuClass = computed(() => `ch-dropdown__menu--${this.placement}`);

  private readonly el       = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private _unlisten?: () => void;

  toggle(): void {
    if (this.isOpen()) this.close();
    else               this.open();
  }

  open(): void {
    this.isOpen.set(true);
    this.opened.emit();
    this._unlisten = this.renderer.listen('document', 'click', (e: MouseEvent) => {
      if (!this.el.nativeElement.contains(e.target as Node)) this.close();
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.closedEvent.emit();
    this._unlisten?.();
    this._unlisten = undefined;
  }

  ngOnDestroy(): void { this._unlisten?.(); }
}

// ── Trigger directive ─────────────────────────────────────────────────────────
@Directive({
  selector: '[chDropdownTrigger]',
  standalone: true,
  host: { '(click)': 'menu.toggle()' },
})
export class ChDropdownTriggerDirective {
  @Input() menu!: ChDropdownMenuComponent;
}
