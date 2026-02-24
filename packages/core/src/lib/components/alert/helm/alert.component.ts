import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  signal,
  output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { cva, cx } from '../../../utils/class-merge.util';
import { ChameleonColorScheme } from '../../../tokens/design-tokens.interface';

export type AlertStatus  = 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'solid' | 'subtle' | 'left-accent' | 'top-accent';

const STATUS_ICONS: Record<AlertStatus, string> = {
  info:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
  error:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
};

const STATUS_COLOR_VARS: Record<AlertStatus, string> = {
  info:    '--ch-alert-color:var(--ch-info);--ch-alert-subtle:var(--ch-info-subtle)',
  success: '--ch-alert-color:var(--ch-success);--ch-alert-subtle:var(--ch-success-subtle)',
  warning: '--ch-alert-color:var(--ch-warning);--ch-alert-subtle:var(--ch-warning-subtle)',
  error:   '--ch-alert-color:var(--ch-error);--ch-alert-subtle:var(--ch-error-subtle)',
};

/**
 * Alert — status message component with optional dismiss.
 *
 * @example
 * <ch-alert status="success" title="Saved!" [dismissible]="true" (dismissed)="onDismiss()">
 *   Your changes have been saved successfully.
 * </ch-alert>
 */
@Component({
  selector: 'ch-alert',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'alertClass()',
    '[style]': 'alertStyle()',
    'role': 'alert',
    '[attr.aria-live]': '"polite"',
    '[hidden]': '!visible()',
  },
  template: `
    <span class="ch-alert-icon" aria-hidden="true" [innerHTML]="statusIcon()"></span>

    <div class="ch-alert-content">
      <p *ngIf="title" class="ch-alert-title">{{ title }}</p>
      <div class="ch-alert-description"><ng-content/></div>
    </div>

    <button
      *ngIf="dismissible"
      class="ch-alert-close"
      type="button"
      aria-label="Close alert"
      (click)="dismiss()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: flex-start;
      gap: var(--ch-space-3);
      padding: var(--ch-space-4);
      border-radius: var(--ch-alert-radius, var(--ch-radius-md));
    }
    :host(.ch-alert--subtle)      { background: var(--ch-alert-subtle); color: var(--ch-alert-color); }
    :host(.ch-alert--solid)       { background: var(--ch-alert-color); color: #fff; }
    :host(.ch-alert--left-accent) { background: var(--ch-alert-subtle); color: var(--ch-alert-color); border-left: 4px solid var(--ch-alert-color); border-radius: 0 var(--ch-radius-md) var(--ch-radius-md) 0; }
    :host(.ch-alert--top-accent)  { background: var(--ch-alert-subtle); color: var(--ch-alert-color); border-top: 4px solid var(--ch-alert-color); }
    :host([hidden]) { display: none; }

    .ch-alert-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.1rem; }
    .ch-alert-icon svg { width: 100%; height: 100%; }
    .ch-alert-content { flex: 1; min-width: 0; }
    .ch-alert-title { font-weight: var(--ch-weight-bold); margin-bottom: var(--ch-space-1); }
    .ch-alert-description { font-size: var(--ch-text-sm); line-height: var(--ch-leading-normal); }
    .ch-alert-close {
      flex-shrink: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      opacity: 0.7;
      padding: var(--ch-space-1);
      border-radius: var(--ch-radius-sm);
      color: currentColor;
      transition: opacity var(--ch-transition-fast);
    }
    .ch-alert-close:hover { opacity: 1; }
    .ch-alert-close:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  `],
})
export class ChAlertComponent {
  @Input() status: AlertStatus = 'info';
  @Input() variant: AlertVariant = 'subtle';
  @Input() title?: string;
  @Input() dismissible = false;

  readonly dismissed = output<void>();
  readonly visible = signal(true);

  readonly statusIcon = computed(() => STATUS_ICONS[this.status]);

  readonly alertClass = computed(() =>
    cx('ch-alert', `ch-alert--${this.variant}`)
  );

  readonly alertStyle = computed(() => STATUS_COLOR_VARS[this.status]);

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
