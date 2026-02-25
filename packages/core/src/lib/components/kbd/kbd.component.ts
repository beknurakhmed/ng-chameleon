import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'ch-kbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <kbd class="ch-kbd" [class]="sizeClass">
      <ng-content />
    </kbd>
  `,
  styles: [`
    .ch-kbd {
      display: inline-flex;
      align-items: center;
      background: var(--ch-bg-subtle);
      border: 1px solid var(--ch-border);
      border-bottom: 2px solid var(--ch-border);
      border-radius: var(--ch-radius-sm, 4px);
      font-family: var(--ch-font-mono);
      font-size: 0.875em;
      font-weight: 500;
      color: var(--ch-text-subtle);
      vertical-align: middle;
      box-shadow: 0 1px 0 var(--ch-border);
      padding: 2px 8px;
    }

    .ch-kbd--sm {
      padding: 0 6px;
    }

    .ch-kbd--md {
      padding: 2px 8px;
    }

    .ch-kbd--lg {
      padding: 4px 10px;
    }
  `],
})
export class KbdComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    return `ch-kbd ch-kbd--${this.size}`;
  }
}
