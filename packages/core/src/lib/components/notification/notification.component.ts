import {
  Component, Input, Output, EventEmitter, signal, computed,
  ChangeDetectionStrategy, ViewEncapsulation, Injectable, ApplicationRef,
  createComponent, EnvironmentInjector, ComponentRef, effect
} from '@angular/core';
import { CommonModule } from '@angular/common';

/* ── Single Notification ───────────────────────────────────────── */
export interface ChNotificationData {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;       // ms, 0 = sticky
  placement?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  closable?: boolean;
  icon?: string;
}

@Component({
  selector: 'ch-notification',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-notification-wrapper" [attr.data-placement]="placement()">
      @for (n of notifications(); track n.id) {
        <div class="ch-notification"
             [attr.data-type]="n.type"
             [class.ch-notification--entering]="n._entering"
             [class.ch-notification--leaving]="n._leaving">
          <div class="ch-notification__icon" *ngIf="n.type">
            @switch (n.type) {
              @case ('success') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
              @case ('error')   { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> }
              @case ('warning') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
              @case ('info')    { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
            }
          </div>
          <div class="ch-notification__content">
            <div class="ch-notification__title">{{ n.title }}</div>
            <div class="ch-notification__description" *ngIf="n.description">{{ n.description }}</div>
          </div>
          <button class="ch-notification__close" *ngIf="n.closable !== false" (click)="close(n.id!)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-notification-wrapper {
      position: fixed; z-index: var(--ch-z-toast, 1080);
      display: flex; flex-direction: column; gap: 8px;
      pointer-events: none; max-width: 384px; width: 100%;
    }
    .ch-notification-wrapper[data-placement="topRight"]    { top: 24px; right: 24px; }
    .ch-notification-wrapper[data-placement="topLeft"]     { top: 24px; left: 24px; }
    .ch-notification-wrapper[data-placement="bottomRight"] { bottom: 24px; right: 24px; }
    .ch-notification-wrapper[data-placement="bottomLeft"]  { bottom: 24px; left: 24px; }

    .ch-notification {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px 20px; pointer-events: auto;
      background: var(--ch-bg-elevated, #fff);
      border: 1px solid var(--ch-border, #e5e7eb);
      border-radius: var(--ch-radius-lg, 8px);
      box-shadow: var(--ch-shadow-lg);
      animation: ch-notif-in 0.3s ease forwards;
    }
    .ch-notification--leaving { animation: ch-notif-out 0.3s ease forwards; }

    .ch-notification__icon { flex-shrink: 0; margin-top: 2px; }
    .ch-notification[data-type="success"] .ch-notification__icon { color: var(--ch-success); }
    .ch-notification[data-type="error"]   .ch-notification__icon { color: var(--ch-error); }
    .ch-notification[data-type="warning"] .ch-notification__icon { color: var(--ch-warning); }
    .ch-notification[data-type="info"]    .ch-notification__icon { color: var(--ch-info); }

    .ch-notification__content { flex: 1; min-width: 0; }
    .ch-notification__title {
      font-weight: var(--ch-weight-semibold, 600);
      font-size: var(--ch-text-sm, 0.875rem);
      color: var(--ch-text);
      line-height: 1.4;
    }
    .ch-notification__description {
      margin-top: 4px;
      font-size: var(--ch-text-sm, 0.875rem);
      color: var(--ch-text-subtle);
      line-height: 1.5;
    }
    .ch-notification__close {
      flex-shrink: 0; background: none; border: none;
      color: var(--ch-text-muted); cursor: pointer;
      padding: 0; display: flex; align-items: center; justify-content: center;
      border-radius: var(--ch-radius-sm);
      transition: color var(--ch-transition-fast, 150ms ease);
    }
    .ch-notification__close:hover { color: var(--ch-text); }

    @keyframes ch-notif-in {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ch-notif-out {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(100%); }
    }
  `]
})
export class ChNotificationContainerComponent {
  notifications = signal<(ChNotificationData & { _entering?: boolean; _leaving?: boolean })[]>([]);
  placement = signal<string>('topRight');

  add(data: ChNotificationData & { _entering?: boolean; _leaving?: boolean }) {
    this.notifications.update(list => [...list, data]);
  }

  close(id: string) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, _leaving: true } : n)
    );
    setTimeout(() => {
      this.notifications.update(list => list.filter(n => n.id !== id));
    }, 300);
  }
}

/* ── Notification Service ──────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class ChNotificationService {
  private containerRef: ComponentRef<ChNotificationContainerComponent> | null = null;
  private counter = 0;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  private ensureContainer(placement: string): ChNotificationContainerComponent {
    if (!this.containerRef) {
      this.containerRef = createComponent(ChNotificationContainerComponent, {
        environmentInjector: this.injector,
      });
      this.containerRef.instance.placement.set(placement);
      this.appRef.attachView(this.containerRef.hostView);
      document.body.appendChild(this.containerRef.location.nativeElement);
    }
    return this.containerRef.instance;
  }

  open(data: ChNotificationData) {
    const id = data.id || `ch-notif-${++this.counter}`;
    const placement = data.placement || 'topRight';
    const container = this.ensureContainer(placement);
    const notification = { ...data, id, _entering: true };
    container.add(notification);

    if (data.duration !== 0) {
      setTimeout(() => container.close(id), data.duration || 4500);
    }
    return id;
  }

  success(title: string, description?: string) { return this.open({ type: 'success', title, description }); }
  error(title: string, description?: string)   { return this.open({ type: 'error', title, description }); }
  warning(title: string, description?: string) { return this.open({ type: 'warning', title, description }); }
  info(title: string, description?: string)    { return this.open({ type: 'info', title, description }); }

  close(id: string) { this.containerRef?.instance.close(id); }

  destroy() {
    if (this.containerRef) {
      this.appRef.detachView(this.containerRef.hostView);
      this.containerRef.destroy();
      this.containerRef = null;
    }
  }
}
