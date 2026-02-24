import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  ViewEncapsulation, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChToastService, Toast } from './toast.service';
import type { ToastStatus } from './toast.service';

// ── Individual Toast ──────────────────────────────────────────────────────────
@Component({
  selector: 'ch-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-toast" [class]="'ch-toast--' + toast.status" role="alert" aria-live="assertive">
      <!-- Status icon -->
      <span class="ch-toast__icon" aria-hidden="true">
        <svg *ngIf="toast.status === 'success'" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg *ngIf="toast.status === 'error'" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <svg *ngIf="toast.status === 'warning'" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <svg *ngIf="toast.status === 'info'" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
      </span>

      <div class="ch-toast__content">
        <p *ngIf="toast.title" class="ch-toast__title">{{ toast.title }}</p>
        <p class="ch-toast__description">{{ toast.description }}</p>
      </div>

      <button *ngIf="toast.isClosable"
        type="button"
        class="ch-toast__close"
        aria-label="Close notification"
        (click)="dismiss.emit(toast.id)">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .ch-toast {
      display: flex;
      align-items: flex-start;
      gap: var(--ch-space-3);
      padding: var(--ch-space-3) var(--ch-space-4);
      background: var(--ch-bg);
      border-radius: var(--ch-radius-lg);
      box-shadow: var(--ch-shadow-lg);
      border-left: 4px solid;
      max-width: 24rem;
      min-width: 18rem;
      animation: ch-slide-in-top var(--ch-transition-normal) ease;

      &--success { border-color: var(--ch-success); .ch-toast__icon { color: var(--ch-success); } }
      &--error   { border-color: var(--ch-error);   .ch-toast__icon { color: var(--ch-error); } }
      &--warning { border-color: var(--ch-warning); .ch-toast__icon { color: var(--ch-warning); } }
      &--info    { border-color: var(--ch-info);    .ch-toast__icon { color: var(--ch-info); } }
    }

    .ch-toast__icon {
      flex-shrink: 0; margin-top: 1px;
      svg { width: 1.25rem; height: 1.25rem; }
    }

    .ch-toast__content { flex: 1; min-width: 0; }

    .ch-toast__title {
      font-size: var(--ch-text-sm);
      font-weight: var(--ch-weight-semibold);
      color: var(--ch-text);
      margin: 0 0 2px;
    }

    .ch-toast__description {
      font-size: var(--ch-text-sm);
      color: var(--ch-text-subtle);
      margin: 0;
    }

    .ch-toast__close {
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      width: 1.25rem; height: 1.25rem;
      background: transparent; border: none; cursor: pointer;
      color: var(--ch-text-muted); border-radius: var(--ch-radius-sm);
      transition: all var(--ch-transition-fast);
      margin-top: 1px;
      svg { width: 0.75rem; height: 0.75rem; }
      &:hover { background: var(--ch-bg-subtle); color: var(--ch-text); }
    }
  `],
})
export class ChToastComponent {
  @Input() toast!: Toast;
  @Output() dismiss = new EventEmitter<string>();
}

// ── Toast Container ───────────────────────────────────────────────────────────
@Component({
  selector: 'ch-toast-container',
  standalone: true,
  imports: [CommonModule, ChToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-toast-container" [class]="'ch-toast-container--' + position">
      <ch-toast
        *ngFor="let t of toastService.toasts(); trackBy: trackById"
        [toast]="t"
        (dismiss)="toastService.dismiss($event)">
      </ch-toast>
    </div>
  `,
  styles: [`
    .ch-toast-container {
      position: fixed;
      z-index: var(--ch-z-toast, 9999);
      display: flex;
      flex-direction: column;
      gap: var(--ch-space-3);
      padding: var(--ch-space-4);
      pointer-events: none;
      > * { pointer-events: all; }

      &--top         { top: 0; left: 50%; transform: translateX(-50%); align-items: center; }
      &--top-right   { top: 0; right: 0; align-items: flex-end; }
      &--top-left    { top: 0; left: 0; align-items: flex-start; }
      &--bottom      { bottom: 0; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }
      &--bottom-right { bottom: 0; right: 0; align-items: flex-end; flex-direction: column-reverse; }
      &--bottom-left  { bottom: 0; left: 0; align-items: flex-start; flex-direction: column-reverse; }
    }
  `],
})
export class ChToastContainerComponent {
  @Input() position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' = 'top-right';

  readonly toastService = inject(ChToastService);

  trackById(_: number, t: Toast): string { return t.id; }
}
