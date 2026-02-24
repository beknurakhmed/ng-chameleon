import {
  Component, Directive, Input, Output, EventEmitter,
  ChangeDetectionStrategy, signal, computed, ViewEncapsulation,
  ElementRef, inject, HostListener, OnDestroy, Renderer2,
  ViewChild, TemplateRef, ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

@Component({
  selector: 'ch-popover',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-popover-container" #container>
      <!-- Trigger slot -->
      <ng-content select="[chPopoverTrigger]"></ng-content>

      <!-- Popover panel -->
      <div *ngIf="isOpen()"
        class="ch-popover"
        [class]="popoverClass()"
        role="dialog"
        [attr.aria-labelledby]="headerId || null">

        <div *ngIf="header" class="ch-popover__header">
          <span [id]="headerId" class="ch-popover__title">{{ header }}</span>
          <button *ngIf="hasClose" type="button" class="ch-popover__close"
            (click)="close()" aria-label="Close">
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="ch-popover__body">
          <ng-content></ng-content>
        </div>

        <!-- Arrow -->
        <div class="ch-popover__arrow"></div>
      </div>
    </div>
  `,
  styles: [`
    .ch-popover-container { position: relative; display: inline-flex; }

    .ch-popover {
      position: absolute;
      z-index: var(--ch-z-popover, 1400);
      min-width: 12rem;
      background: var(--ch-bg);
      border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-lg);
      box-shadow: var(--ch-shadow-lg);
      animation: ch-fade-in var(--ch-transition-fast) ease;

      &--bottom-start, &--bottom, &--bottom-end {
        top: calc(100% + 8px); left: 0;
      }
      &--top-start, &--top, &--top-end {
        bottom: calc(100% + 8px); left: 0;
      }
      &--right { top: 50%; left: calc(100% + 8px); transform: translateY(-50%); }
      &--left  { top: 50%; right: calc(100% + 8px); transform: translateY(-50%); }

      &--bottom-end { left: auto; right: 0; }
      &--top-end    { left: auto; right: 0; }
    }

    .ch-popover__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--ch-space-3) var(--ch-space-4);
      border-bottom: 1px solid var(--ch-border);
    }

    .ch-popover__title {
      font-size: var(--ch-text-sm);
      font-weight: var(--ch-weight-semibold);
      color: var(--ch-text);
    }

    .ch-popover__close {
      display: flex; align-items: center; justify-content: center;
      width: 1.25rem; height: 1.25rem;
      border: none; background: transparent; cursor: pointer;
      border-radius: var(--ch-radius-sm); color: var(--ch-text-muted);
      &:hover { background: var(--ch-bg-subtle); color: var(--ch-text); }
      svg { width: 0.75rem; height: 0.75rem; }
    }

    .ch-popover__body { padding: var(--ch-space-3) var(--ch-space-4); }

    .ch-popover__arrow { display: none; /* TODO: arrow impl */ }
  `],
})
export class ChPopoverComponent implements OnDestroy {
  @Input() header?: string;
  @Input() placement: PopoverPlacement = 'bottom-start';
  @Input() hasClose = true;
  @Input() trigger: 'click' | 'hover' = 'click';

  @Output() opened = new EventEmitter<void>();
  @Output() closedEvent = new EventEmitter<void>();

  readonly headerId = `ch-popover-header-${Math.random().toString(36).slice(2, 8)}`;

  readonly isOpen = signal(false);

  readonly popoverClass = computed(() => `ch-popover--${this.placement}`);

  private readonly el = inject(ElementRef<HTMLElement>);
  private _unlistenOutside?: () => void;
  private readonly renderer = inject(Renderer2);

  toggle(): void {
    if (this.isOpen()) this.close();
    else               this.open();
  }

  open(): void {
    this.isOpen.set(true);
    this.opened.emit();
    this._unlistenOutside = this.renderer.listen('document', 'click', (e: MouseEvent) => {
      if (!this.el.nativeElement.contains(e.target as Node)) this.close();
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.closedEvent.emit();
    this._unlistenOutside?.();
    this._unlistenOutside = undefined;
  }

  ngOnDestroy(): void { this._unlistenOutside?.(); }
}

// ── Trigger directive ─────────────────────────────────────────────────────────
@Directive({
  selector: '[chPopoverTrigger]',
  standalone: true,
  host: { '(click)': 'popover.toggle()' },
})
export class ChPopoverTriggerDirective {
  @Input() popover!: ChPopoverComponent;
}
