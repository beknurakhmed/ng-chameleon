import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ch-empty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-empty">
      @if (image() === 'default') {
        <svg
          class="ch-empty__image"
          [attr.width]="imageSize()"
          [attr.height]="imageSize()"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- Box back edge -->
          <path d="M20 35 L50 20 L80 35" />
          <!-- Box left side -->
          <path d="M20 35 L20 70 L50 85" />
          <!-- Box right side -->
          <path d="M80 35 L80 70 L50 85" />
          <!-- Box bottom center line -->
          <path d="M50 50 L50 85" />
          <!-- Box left inner flap -->
          <path d="M20 35 L50 50" />
          <!-- Box right inner flap -->
          <path d="M80 35 L50 50" />
          <!-- Open flap left -->
          <path d="M20 35 L10 28" />
          <!-- Open flap right -->
          <path d="M80 35 L90 28" />
          <!-- Small circle accent -->
          <circle cx="50" cy="12" r="3" />
        </svg>
      }

      @if (image() === 'simple') {
        <svg
          class="ch-empty__image"
          [attr.width]="imageSize()"
          [attr.height]="Math.round(imageSize() * 0.2)"
          [attr.viewBox]="'0 0 100 20'"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <line x1="10" y1="14" x2="90" y2="14" />
          <circle cx="50" cy="6" r="4" />
        </svg>
      }

      <p class="ch-empty__description">{{ description() }}</p>

      <div class="ch-empty__actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .ch-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }

    .ch-empty__image {
      color: var(--ch-border, #d0d5dd);
      margin-bottom: 1rem;
    }

    .ch-empty__description {
      color: var(--ch-text-muted, #667085);
      font-size: 0.875rem;
      line-height: 1.25rem;
      margin: 0 0 0.75rem;
    }

    .ch-empty__actions:empty {
      display: none;
    }
  `,
})
export class EmptyComponent {
  readonly description = input<string>('No data');
  readonly image = input<'default' | 'simple' | 'none'>('default');
  readonly imageSize = input<number>(100);

  protected readonly Math = Math;
}
