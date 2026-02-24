import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, OnChanges, SimpleChanges,
  HostListener, inject, Renderer2, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';
export type DrawerSize      = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ch-drawer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div *ngIf="visible()"
      class="ch-drawer-overlay"
      [class.ch-drawer-overlay--visible]="animating()"
      (click)="onBackdropClick()">

      <div class="ch-drawer"
        [class]="drawerClass()"
        [class.ch-drawer--visible]="animating()"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId"
        (click)="$event.stopPropagation()">

        <div class="ch-drawer__header">
          <h2 *ngIf="title" [id]="titleId" class="ch-drawer__title">{{ title }}</h2>
          <ng-content select="[chDrawerHeader]"></ng-content>
          <button type="button" class="ch-drawer__close" aria-label="Close" (click)="close()">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="ch-drawer__body">
          <ng-content></ng-content>
        </div>

        <div class="ch-drawer__footer">
          <ng-content select="[chDrawerFooter]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ch-drawer-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ch-z-modal, 1300);
      background: rgba(0,0,0,0);
      transition: background var(--ch-transition-normal);
      &--visible { background: rgba(0,0,0,0.5); }
    }

    .ch-drawer {
      position: fixed;
      z-index: var(--ch-z-modal, 1300);
      background: var(--ch-bg);
      box-shadow: var(--ch-shadow-xl);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform var(--ch-transition-normal);

      /* Placement */
      &--left  { top: 0; left: 0; bottom: 0; transform: translateX(-100%);
        &.ch-drawer--visible { transform: translateX(0); } }
      &--right { top: 0; right: 0; bottom: 0; transform: translateX(100%);
        &.ch-drawer--visible { transform: translateX(0); } }
      &--top   { top: 0; left: 0; right: 0; transform: translateY(-100%);
        &.ch-drawer--visible { transform: translateY(0); } }
      &--bottom { bottom: 0; left: 0; right: 0; transform: translateY(100%);
        &.ch-drawer--visible { transform: translateY(0); } }

      /* Sizes — applied to width for left/right, height for top/bottom */
      &--left, &--right {
        &.ch-drawer--sm   { width: 16rem; }
        &.ch-drawer--md   { width: 24rem; }
        &.ch-drawer--lg   { width: 32rem; }
        &.ch-drawer--xl   { width: 42rem; }
        &.ch-drawer--full { width: 100vw; }
      }
      &--top, &--bottom {
        &.ch-drawer--sm   { height: 30vh; }
        &.ch-drawer--md   { height: 50vh; }
        &.ch-drawer--lg   { height: 70vh; }
        &.ch-drawer--xl   { height: 85vh; }
        &.ch-drawer--full { height: 100vh; }
      }
    }

    .ch-drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ch-space-4) var(--ch-space-6);
      border-bottom: 1px solid var(--ch-border);
      flex-shrink: 0;
    }

    .ch-drawer__title {
      font-size: var(--ch-text-lg);
      font-weight: var(--ch-weight-semibold);
      color: var(--ch-text);
      margin: 0;
    }

    .ch-drawer__close {
      display: flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem;
      border: none; background: transparent;
      border-radius: var(--ch-radius-md);
      color: var(--ch-text-muted); cursor: pointer;
      transition: all var(--ch-transition-fast);
      svg { width: 1rem; height: 1rem; }
      &:hover { background: var(--ch-bg-subtle); color: var(--ch-text); }
    }

    .ch-drawer__body {
      padding: var(--ch-space-6);
      overflow-y: auto;
      flex: 1;
    }

    .ch-drawer__footer {
      padding: var(--ch-space-4) var(--ch-space-6);
      border-top: 1px solid var(--ch-border);
      display: flex; gap: var(--ch-space-3); justify-content: flex-end;
      flex-shrink: 0;
      &:empty { display: none; }
    }
  `],
})
export class ChDrawerComponent implements OnChanges, OnDestroy {
  @Input() isOpen    = false;
  @Input() title?: string;
  @Input() placement: DrawerPlacement = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  readonly titleId = `ch-drawer-title-${Math.random().toString(36).slice(2, 8)}`;

  readonly visible   = signal(false);
  readonly animating = signal(false);

  private _closeTimer?: ReturnType<typeof setTimeout>;
  private readonly renderer = inject(Renderer2);

  readonly drawerClass = computed(() =>
    `ch-drawer--${this.placement} ch-drawer--${this.size}`
  );

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.isOpen) this.close(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) this._open();
      else             this._close();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this._closeTimer);
    this.renderer.removeClass(document.body, 'ch-modal-open');
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  close(): void { this.closed.emit(); }

  private _open(): void {
    clearTimeout(this._closeTimer);
    this.visible.set(true);
    this.renderer.addClass(document.body, 'ch-modal-open');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.animating.set(true))
    );
  }

  private _close(): void {
    this.animating.set(false);
    this._closeTimer = setTimeout(() => {
      this.visible.set(false);
      this.renderer.removeClass(document.body, 'ch-modal-open');
    }, 300);
  }
}
