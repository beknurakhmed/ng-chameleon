import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// ─────────────────────────────────────────────
// ChToggleComponent
// ─────────────────────────────────────────────

@Component({
  selector: 'ch-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      class="ch-toggle"
      [class.ch-toggle--pressed]="pressed"
      [class.ch-toggle--disabled]="disabled"
      [class.ch-toggle--outline]="variant === 'outline'"
      [class.ch-toggle--sm]="size === 'sm'"
      [class.ch-toggle--md]="size === 'md'"
      [class.ch-toggle--lg]="size === 'lg'"
      [attr.aria-pressed]="pressed"
      [attr.disabled]="disabled ? true : null"
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .ch-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-weight: normal;
        cursor: pointer;
        border-radius: var(--ch-radius-md, 6px);
        transition: background-color 0.15s ease, border-color 0.15s ease,
          font-weight 0.15s ease, opacity 0.15s ease;
        user-select: none;
        outline: none;
        line-height: 1;
        white-space: nowrap;
      }

      /* ── Sizes ── */
      .ch-toggle--sm {
        height: 2rem; /* h-8 = 32px */
        padding-left: 0.5rem; /* px-2 */
        padding-right: 0.5rem;
        font-size: 0.8125rem;
      }

      .ch-toggle--md {
        height: 2.25rem; /* h-9 = 36px */
        padding-left: 0.75rem; /* px-3 */
        padding-right: 0.75rem;
        font-size: 0.875rem;
      }

      .ch-toggle--lg {
        height: 2.5rem; /* h-10 = 40px */
        padding-left: 1rem; /* px-4 */
        padding-right: 1rem;
        font-size: 0.9375rem;
      }

      /* ── Default variant (no border) ── */
      .ch-toggle:hover:not(.ch-toggle--pressed):not(.ch-toggle--disabled) {
        background-color: var(--ch-bg-subtle, rgba(0, 0, 0, 0.06));
      }

      /* ── Outline variant ── */
      .ch-toggle--outline {
        border: 1px solid var(--ch-border, rgba(0, 0, 0, 0.12));
      }

      .ch-toggle--outline:hover:not(.ch-toggle--pressed):not(.ch-toggle--disabled) {
        background-color: var(--ch-bg-subtle, rgba(0, 0, 0, 0.06));
      }

      /* ── Pressed state ── */
      .ch-toggle--pressed {
        background-color: var(--ch-bg-subtle, rgba(0, 0, 0, 0.06));
        font-weight: 500;
      }

      .ch-toggle--pressed.ch-toggle--outline {
        background-color: var(--ch-primary-subtle, rgba(0, 0, 0, 0.08));
      }

      .ch-toggle--pressed:hover:not(.ch-toggle--disabled) {
        background-color: var(--ch-bg-subtle, rgba(0, 0, 0, 0.1));
      }

      /* ── Disabled state ── */
      .ch-toggle--disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
      }

      /* ── Focus-visible ── */
      .ch-toggle:focus-visible {
        outline: 2px solid var(--ch-ring, rgba(59, 130, 246, 0.5));
        outline-offset: 2px;
      }
    `,
  ],
})
export class ChToggleComponent {
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() pressed = false;
  @Input() disabled = false;

  @Output() pressedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.pressed = !this.pressed;
    this.pressedChange.emit(this.pressed);
  }
}

// ─────────────────────────────────────────────
// ChToggleGroupComponent
// ─────────────────────────────────────────────

@Component({
  selector: 'ch-toggle-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-toggle-group" role="group">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .ch-toggle-group {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: 1px;
      }

      /* Reset border-radius for items inside the group */
      .ch-toggle-group .ch-toggle {
        border-radius: 0;
      }

      .ch-toggle-group .ch-toggle:first-child {
        border-top-left-radius: var(--ch-radius-md, 6px);
        border-bottom-left-radius: var(--ch-radius-md, 6px);
      }

      .ch-toggle-group .ch-toggle:last-child {
        border-top-right-radius: var(--ch-radius-md, 6px);
        border-bottom-right-radius: var(--ch-radius-md, 6px);
      }

      /* Collapse duplicate borders for outline items in a group */
      .ch-toggle-group .ch-toggle--outline + .ch-toggle--outline {
        margin-left: -1px;
      }
    `,
  ],
})
export class ChToggleGroupComponent implements AfterContentInit, OnDestroy {
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() value: string | string[] = [];

  @Output() valueChange = new EventEmitter<string | string[]>();

  @ContentChildren(ChToggleComponent)
  toggles!: QueryList<ChToggleComponent>;

  private subscriptions: Subscription[] = [];

  ngAfterContentInit(): void {
    this.subscribeToToggles();

    this.toggles.changes.subscribe(() => {
      this.clearSubscriptions();
      this.subscribeToToggles();
    });
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }

  private subscribeToToggles(): void {
    this.toggles.forEach((toggle) => {
      const sub = toggle.pressedChange.subscribe(() => {
        this.syncValue();
      });
      this.subscriptions.push(sub);
    });
  }

  private syncValue(): void {
    const pressedToggles = this.toggles.filter((t) => t.pressed);

    if (this.type === 'single') {
      // In single mode, only the last-pressed toggle stays active
      if (pressedToggles.length > 1) {
        const lastPressed = pressedToggles[pressedToggles.length - 1];
        this.toggles.forEach((t) => {
          if (t !== lastPressed) {
            t.pressed = false;
          }
        });
      }

      const active = this.toggles.find((t) => t.pressed);
      const newValue = active ? this.getToggleValue(active) : '';
      this.value = newValue;
      this.valueChange.emit(newValue);
    } else {
      // Multiple mode — collect all pressed values
      const values = pressedToggles.map((t) => this.getToggleValue(t));
      this.value = values;
      this.valueChange.emit(values);
    }
  }

  private getToggleValue(toggle: ChToggleComponent): string {
    // Derive a value from the toggle's host element text content as a fallback
    const index = this.toggles.toArray().indexOf(toggle);
    return String(index);
  }

  private clearSubscriptions(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }
}
