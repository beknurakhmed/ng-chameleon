import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'ch-alert-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ch-alert-dialog-backdrop {
      position: fixed;
      inset: 0;
      background: var(--ch-bg-overlay, rgba(0, 0, 0, 0.5));
      z-index: var(--ch-z-modal, 1000);
      animation: ch-alert-dialog-fade-in 150ms ease-out;
    }

    .ch-alert-dialog-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: var(--ch-z-modal, 1000);
      width: 100%;
      max-width: 450px;
      background: var(--ch-bg, #fff);
      border-radius: var(--ch-radius-lg, 12px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                  0 4px 6px -4px rgba(0, 0, 0, 0.1);
      padding: var(--ch-space-6, 24px);
      animation: ch-alert-dialog-scale-in 150ms ease-out;
    }

    .ch-alert-dialog-title {
      margin: 0;
      font-size: var(--ch-font-size-lg, 1.125rem);
      font-weight: var(--ch-font-weight-semibold, 600);
      color: var(--ch-text, #111);
      line-height: 1.4;
    }

    .ch-alert-dialog-description {
      margin: var(--ch-space-2, 8px) 0 0;
      font-size: var(--ch-font-size-sm, 0.875rem);
      color: var(--ch-text-subtle, #6b7280);
      line-height: 1.5;
    }

    .ch-alert-dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ch-space-2, 8px);
      margin-top: var(--ch-space-6, 24px);
    }

    .ch-alert-dialog-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--ch-space-2, 8px) var(--ch-space-4, 16px);
      font-size: var(--ch-font-size-sm, 0.875rem);
      font-weight: var(--ch-font-weight-semibold, 600);
      line-height: 1;
      border-radius: var(--ch-radius-md, 8px);
      cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease, opacity 150ms ease;
      border: 1px solid transparent;
      min-height: 36px;
    }

    .ch-alert-dialog-btn:focus-visible {
      outline: 2px solid var(--ch-ring, #3b82f6);
      outline-offset: 2px;
    }

    .ch-alert-dialog-btn--cancel {
      background: transparent;
      border-color: var(--ch-border, #d1d5db);
      color: var(--ch-text, #111);
    }

    .ch-alert-dialog-btn--cancel:hover {
      background: var(--ch-bg-hover, #f3f4f6);
    }

    .ch-alert-dialog-btn--confirm {
      background: var(--ch-bg-primary, #111);
      color: var(--ch-text-on-primary, #fff);
      border-color: var(--ch-bg-primary, #111);
    }

    .ch-alert-dialog-btn--confirm:hover {
      opacity: 0.9;
    }

    .ch-alert-dialog-btn--destructive {
      background: var(--ch-bg-destructive, #dc2626);
      color: var(--ch-text-on-destructive, #fff);
      border-color: var(--ch-bg-destructive, #dc2626);
    }

    .ch-alert-dialog-btn--destructive:hover {
      opacity: 0.9;
    }

    .ch-alert-dialog-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ch-alert-dialog-btn__spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: var(--ch-space-2, 8px);
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: ch-alert-dialog-spin 600ms linear infinite;
    }

    @keyframes ch-alert-dialog-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes ch-alert-dialog-scale-in {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes ch-alert-dialog-spin {
      to { transform: rotate(360deg); }
    }
  `],
  template: `
    @if (open()) {
      <div class="ch-alert-dialog-backdrop" aria-hidden="true"></div>

      <div
        class="ch-alert-dialog-panel"
        role="alertdialog"
        [attr.aria-label]="title()"
        aria-modal="true"
      >
        <h2 class="ch-alert-dialog-title">{{ title() }}</h2>

        @if (description()) {
          <p class="ch-alert-dialog-description">{{ description() }}</p>
        }

        <div class="ch-alert-dialog-footer">
          <button
            type="button"
            class="ch-alert-dialog-btn ch-alert-dialog-btn--cancel"
            [disabled]="loading()"
            (click)="onCancel()"
          >
            {{ cancelText() }}
          </button>

          <button
            type="button"
            class="ch-alert-dialog-btn"
            [class.ch-alert-dialog-btn--confirm]="!destructive()"
            [class.ch-alert-dialog-btn--destructive]="destructive()"
            [disabled]="loading()"
            (click)="onConfirm()"
          >
            @if (loading()) {
              <span class="ch-alert-dialog-btn__spinner" aria-hidden="true"></span>
            }
            {{ confirmText() }}
          </button>
        </div>
      </div>
    }
  `,
})
export class AlertDialogComponent {
  /** Whether the dialog is open. */
  readonly open = input<boolean>(false);

  /** Dialog title. */
  readonly title = input<string>('');

  /** Dialog description / body text. */
  readonly description = input<string>('');

  /** Label for the cancel button. */
  readonly cancelText = input<string>('Cancel');

  /** Label for the confirm button. */
  readonly confirmText = input<string>('Continue');

  /** When true the confirm button uses a red / destructive style. */
  readonly destructive = input<boolean>(false);

  /** Shows a loading spinner on the confirm button and disables both buttons. */
  readonly loading = input<boolean>(false);

  /** Emits when the open state should change (e.g. dialog closed). */
  readonly openChange = output<boolean>();

  /** Emits when the user clicks the confirm button. */
  readonly confirm = output<void>();

  /** Emits when the user cancels (cancel button or Escape key). */
  readonly cancel = output<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open() && !this.loading()) {
      this.onCancel();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.openChange.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
