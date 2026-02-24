import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { cx } from '../../utils/class-merge.util';

export type CardVariant = 'elevated' | 'outline' | 'filled' | 'unstyled';

/**
 * Card — compound component with Header, Body, Footer sub-components.
 *
 * @example
 * <ch-card>
 *   <ch-card-header>
 *     <span chText fontSize="xl" fontWeight="bold">Title</span>
 *   </ch-card-header>
 *   <ch-card-body>Content here</ch-card-body>
 *   <ch-card-footer>
 *     <ch-button>Action</ch-button>
 *   </ch-card-footer>
 * </ch-card>
 */
@Component({
  selector: 'ch-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `<ng-content/>`,
  styles: [`
    :host {
      display: block;
      background-color: var(--ch-card-bg);
      border-radius: var(--ch-card-radius);
      overflow: hidden;
    }
    :host(.ch-card--elevated) { box-shadow: var(--ch-card-shadow); }
    :host(.ch-card--outline)  { border: 1px solid var(--ch-card-border); }
    :host(.ch-card--filled)   { background-color: var(--ch-bg-subtle); }
  `],
})
export class ChCardComponent {
  @Input() variant: CardVariant = 'elevated';

  readonly hostClass = computed(() => cx('ch-card', `ch-card--${this.variant}`));
}

// ── Card Header ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ch-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content/>`,
  styles: [`
    :host {
      display: block;
      padding: var(--ch-space-4) var(--ch-card-padding);
      border-bottom: 1px solid var(--ch-card-header-border, var(--ch-border));
      font-weight: var(--ch-weight-semibold);
      font-size: var(--ch-text-lg);
      color: var(--ch-text);
    }
  `],
})
export class ChCardHeaderComponent {}

// ── Card Body ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ch-card-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content/>`,
  styles: [`
    :host {
      display: block;
      padding: var(--ch-card-padding);
      color: var(--ch-text);
      line-height: var(--ch-leading-normal);
    }
  `],
})
export class ChCardBodyComponent {}

// ── Card Footer ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ch-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content/>`,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      padding: var(--ch-space-3) var(--ch-card-padding);
      border-top: 1px solid var(--ch-border);
      gap: var(--ch-space-3);
    }
  `],
})
export class ChCardFooterComponent {}
