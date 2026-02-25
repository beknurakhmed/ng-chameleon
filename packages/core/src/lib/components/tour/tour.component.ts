import {
  Component, Input, Output, EventEmitter, signal, computed, effect,
  ChangeDetectionStrategy, ViewEncapsulation, Injectable, ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChTourStep {
  target?: string | ElementRef;
  title: string;
  description?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  cover?: string;
}

@Component({
  selector: 'ch-tour',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div class="ch-tour-mask" (click)="onMaskClick()"></div>
      <div class="ch-tour-spotlight" [style]="spotlightStyle()"></div>
      <div class="ch-tour-popover" [attr.data-placement]="currentStep()?.placement || 'bottom'" [style]="popoverStyle()">
        @if (currentStep()?.cover) {
          <div class="ch-tour-popover__cover">
            <img [src]="currentStep()!.cover" alt="" />
          </div>
        }
        <div class="ch-tour-popover__header">
          <span class="ch-tour-popover__title">{{ currentStep()?.title }}</span>
        </div>
        @if (currentStep()?.description) {
          <div class="ch-tour-popover__body">{{ currentStep()!.description }}</div>
        }
        <div class="ch-tour-popover__footer">
          <div class="ch-tour-popover__indicators">
            @for (step of steps; track $index) {
              <span class="ch-tour-popover__dot" [class.ch-tour-popover__dot--active]="$index === current()"></span>
            }
          </div>
          <div class="ch-tour-popover__actions">
            @if (current() > 0) {
              <button class="ch-tour-btn ch-tour-btn--secondary" (click)="prev()">Prev</button>
            }
            @if (current() < steps.length - 1) {
              <button class="ch-tour-btn ch-tour-btn--primary" (click)="next()">Next</button>
            } @else {
              <button class="ch-tour-btn ch-tour-btn--primary" (click)="finish()">Finish</button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .ch-tour-mask {
      position: fixed; inset: 0; z-index: var(--ch-z-modal, 1050);
      background: rgba(0,0,0,0.45);
    }
    .ch-tour-spotlight {
      position: fixed; z-index: calc(var(--ch-z-modal, 1050) + 1);
      border-radius: var(--ch-radius-md, 6px);
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.45);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .ch-tour-popover {
      position: fixed; z-index: calc(var(--ch-z-modal, 1050) + 2);
      background: var(--ch-bg-elevated, #fff);
      border: 1px solid var(--ch-border, #e5e7eb);
      border-radius: var(--ch-radius-lg, 8px);
      box-shadow: var(--ch-shadow-lg);
      width: 340px; max-width: calc(100vw - 48px);
      animation: ch-tour-in 0.2s ease;
    }
    .ch-tour-popover__cover { border-radius: var(--ch-radius-lg) var(--ch-radius-lg) 0 0; overflow: hidden; }
    .ch-tour-popover__cover img { width: 100%; display: block; }
    .ch-tour-popover__header { padding: 12px 16px 4px; }
    .ch-tour-popover__title { font-weight: var(--ch-weight-semibold, 600); font-size: var(--ch-text-sm); color: var(--ch-text); }
    .ch-tour-popover__body { padding: 0 16px 8px; font-size: var(--ch-text-sm); color: var(--ch-text-subtle); line-height: 1.5; }
    .ch-tour-popover__footer { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px 12px; }
    .ch-tour-popover__indicators { display: flex; gap: 4px; }
    .ch-tour-popover__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ch-border-strong, #ccc); }
    .ch-tour-popover__dot--active { background: var(--ch-primary); }
    .ch-tour-popover__actions { display: flex; gap: 8px; }
    .ch-tour-btn {
      border: none; border-radius: var(--ch-btn-radius, var(--ch-radius-md)); cursor: pointer;
      font-size: var(--ch-text-sm); padding: 4px 12px; font-weight: var(--ch-weight-medium, 500);
      transition: all var(--ch-transition-fast, 150ms ease);
    }
    .ch-tour-btn--primary { background: var(--ch-primary); color: var(--ch-primary-fg, #fff); }
    .ch-tour-btn--primary:hover { background: var(--ch-primary-hover); }
    .ch-tour-btn--secondary { background: var(--ch-secondary, #f3f4f6); color: var(--ch-text); }
    .ch-tour-btn--secondary:hover { background: var(--ch-secondary-hover, #e5e7eb); }
    @keyframes ch-tour-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ChTourComponent implements OnDestroy {
  @Input() steps: ChTourStep[] = [];
  @Input() set open(v: boolean) { this.visible.set(v); if (v) this.goTo(0); }
  @Input() closable = true;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() stepChange = new EventEmitter<number>();
  @Output() tourFinish = new EventEmitter<void>();

  visible = signal(false);
  current = signal(0);
  currentStep = computed(() => this.steps[this.current()]);
  spotlightStyle = signal('');
  popoverStyle = signal('');

  private resizeObs?: ResizeObserver;

  ngOnDestroy() { this.resizeObs?.disconnect(); }

  goTo(index: number) {
    this.current.set(index);
    this.stepChange.emit(index);
    requestAnimationFrame(() => this.position());
  }

  next() { if (this.current() < this.steps.length - 1) this.goTo(this.current() + 1); }
  prev() { if (this.current() > 0) this.goTo(this.current() - 1); }

  finish() {
    this.visible.set(false);
    this.openChange.emit(false);
    this.tourFinish.emit();
  }

  onMaskClick() {
    if (this.closable) this.finish();
  }

  private position() {
    const step = this.currentStep();
    if (!step?.target) {
      this.spotlightStyle.set('display:none');
      this.popoverStyle.set('top:50%;left:50%;transform:translate(-50%,-50%)');
      return;
    }
    const el = typeof step.target === 'string'
      ? document.querySelector(step.target) as HTMLElement
      : step.target.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pad = 4;
    this.spotlightStyle.set(
      `top:${rect.top - pad}px;left:${rect.left - pad}px;width:${rect.width + pad * 2}px;height:${rect.height + pad * 2}px`
    );
    const placement = step.placement || 'bottom';
    let top = 0, left = 0;
    switch (placement) {
      case 'bottom': top = rect.bottom + 12; left = rect.left; break;
      case 'top':    top = rect.top - 12;    left = rect.left; break;
      case 'left':   top = rect.top;         left = rect.left - 352; break;
      case 'right':  top = rect.top;         left = rect.right + 12; break;
    }
    if (placement === 'top') {
      this.popoverStyle.set(`bottom:${window.innerHeight - top}px;left:${Math.max(8, left)}px`);
    } else {
      this.popoverStyle.set(`top:${top}px;left:${Math.max(8, left)}px`);
    }
  }
}
