import { Injectable, signal, computed } from '@angular/core';

export type ToastStatus   = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id:          string;
  title?:      string;
  description: string;
  status:      ToastStatus;
  duration:    number;
  isClosable:  boolean;
}

export interface ToastOptions {
  title?:      string;
  description: string;
  status?:     ToastStatus;
  duration?:   number;
  isClosable?: boolean;
  position?:   ToastPosition;
}

@Injectable({ providedIn: 'root' })
export class ChToastService {
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  toast(opts: ToastOptions): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: Toast = {
      id,
      title:       opts.title,
      description: opts.description,
      status:      opts.status     ?? 'info',
      duration:    opts.duration   ?? 5000,
      isClosable:  opts.isClosable ?? true,
    };

    this._toasts.update(ts => [...ts, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(description: string, title?: string): string {
    return this.toast({ description, title, status: 'success' });
  }

  error(description: string, title?: string): string {
    return this.toast({ description, title, status: 'error' });
  }

  warning(description: string, title?: string): string {
    return this.toast({ description, title, status: 'warning' });
  }

  info(description: string, title?: string): string {
    return this.toast({ description, title, status: 'info' });
  }

  dismiss(id: string): void {
    this._toasts.update(ts => ts.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this._toasts.set([]);
  }
}
