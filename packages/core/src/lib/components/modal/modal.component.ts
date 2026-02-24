import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, OnChanges, SimpleChanges,
  HostListener, inject, Renderer2, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ch-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Backdrop -->
    <div *ngIf="visible()"
      class="ch-modal-overlay"
      [class.ch-modal-overlay--visible]="animating()"
      (click)="onBackdropClick()">

      <!-- Dialog -->
      <div class="ch-modal"
        [class]="dialogClass()"
        [class.ch-modal--visible]="animating()"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId"
        (click)="$event.stopPropagation()">

        <!-- Header -->
        <div *ngIf="title || hasClose" class="ch-modal__header">
          <h2 *ngIf="title" [id]="titleId" class="ch-modal__title">{{ title }}</h2>
          <ng-content select="[chModalHeader]"></ng-content>
          <button *ngIf="hasClose"
            type="button"
            class="ch-modal__close"
            aria-label="Close"
            (click)="close()">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="ch-modal__body">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div class="ch-modal__footer">
          <ng-content select="[chModalFooter]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ch-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ch-z-modal, 1300);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ch-space-4);
      background: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
      transition: background var(--ch-transition-normal), backdrop-filter var(--ch-transition-normal);

      &--visible {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
      }
    }

    .ch-modal {
      position: relative;
      width: 100%;
      max-height: calc(100vh - var(--ch-space-16));
      background: var(--ch-bg);
      border-radius: var(--ch-radius-xl);
      box-shadow: var(--ch-shadow-xl);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.95) translateY(-8px);
      opacity: 0;
      transition: transform var(--ch-transition-normal), opacity var(--ch-transition-normal);

      &--visible { transform: scale(1) translateY(0); opacity: 1; }

      &--xs  { max-width: 20rem; }
      &--sm  { max-width: 28rem; }
      &--md  { max-width: 36rem; }
      &--lg  { max-width: 48rem; }
      &--xl  { max-width: 64rem; }
      &--full {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
        margin: 0;
      }
    }

    .ch-modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ch-space-4) var(--ch-space-6);
      border-bottom: 1px solid var(--ch-border);
      flex-shrink: 0;
    }

    .ch-modal__title {
      font-size: var(--ch-text-lg);
      font-weight: var(--ch-weight-semibold);
      color: var(--ch-text);
      margin: 0;
    }

    .ch-modal__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem; height: 2rem;
      border: none;
      background: transparent;
      border-radius: var(--ch-radius-md);
      color: var(--ch-text-muted);
      cursor: pointer;
      transition: all var(--ch-transition-fast);
      flex-shrink: 0;

      svg { width: 1rem; height: 1rem; }

      &:hover { background: var(--ch-bg-subtle); color: var(--ch-text); }
    }

    .ch-modal__body {
      padding: var(--ch-space-6);
      overflow-y: auto;
      flex: 1;
    }

    .ch-modal__footer {
      padding: var(--ch-space-4) var(--ch-space-6);
      border-top: 1px solid var(--ch-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--ch-space-3);
      flex-shrink: 0;

      &:empty { display: none; }
    }
  `],
})
export class ChModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() size: ModalSize = 'md';
  @Input() hasClose = true;
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  readonly titleId = `ch-modal-title-${Math.random().toString(36).slice(2, 8)}`;

  readonly visible   = signal(false);
  readonly animating = signal(false);

  private _closeTimer?: ReturnType<typeof setTimeout>;
  private readonly renderer = inject(Renderer2);

  readonly dialogClass = computed(() => `ch-modal--${this.size}`);

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

  close(): void {
    this.closed.emit();
  }

  private _open(): void {
    clearTimeout(this._closeTimer);
    this.visible.set(true);
    this.renderer.addClass(document.body, 'ch-modal-open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.animating.set(true));
    });
  }

  private _close(): void {
    this.animating.set(false);
    this._closeTimer = setTimeout(() => {
      this.visible.set(false);
      this.renderer.removeClass(document.body, 'ch-modal-open');
    }, 200);
  }
}
