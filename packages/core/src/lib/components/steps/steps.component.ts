import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type StepItem = {
  title: string;
  description?: string;
  icon?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
};

@Component({
  selector: 'ch-steps',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ch-steps"
      [class.ch-steps--horizontal]="direction === 'horizontal'"
      [class.ch-steps--vertical]="direction === 'vertical'"
      [class.ch-steps--sm]="size === 'sm'"
      [class.ch-steps--label-vertical]="labelPlacement === 'vertical'"
    >
      <div
        *ngFor="let item of items; let i = index; let last = last"
        class="ch-steps__item"
        [class.ch-steps__item--wait]="getStatus(i) === 'wait'"
        [class.ch-steps__item--process]="getStatus(i) === 'process'"
        [class.ch-steps__item--finish]="getStatus(i) === 'finish'"
        [class.ch-steps__item--error]="getStatus(i) === 'error'"
        (click)="onStepClick(i)"
      >
        <div class="ch-steps__item-container">
          <div class="ch-steps__icon-wrapper">
            <div class="ch-steps__icon">
              <ng-container *ngIf="item.icon; else defaultIcon">
                <span class="ch-steps__custom-icon">{{ item.icon }}</span>
              </ng-container>
              <ng-template #defaultIcon>
                <svg
                  *ngIf="getStatus(i) === 'finish'"
                  class="ch-steps__icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="4 12 10 18 20 6"></polyline>
                </svg>
                <svg
                  *ngIf="getStatus(i) === 'error'"
                  class="ch-steps__icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                </svg>
                <span
                  *ngIf="getStatus(i) !== 'finish' && getStatus(i) !== 'error'"
                  class="ch-steps__icon-number"
                >
                  {{ i + 1 }}
                </span>
              </ng-template>
            </div>
            <div
              *ngIf="!last"
              class="ch-steps__connector"
              [class.ch-steps__connector--finished]="getStatus(i) === 'finish'"
            ></div>
          </div>
          <div class="ch-steps__content">
            <div class="ch-steps__title">{{ item.title }}</div>
            <div *ngIf="item.description" class="ch-steps__description">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ch-steps {
      --_ch-steps-icon-size: 24px;
      --_ch-steps-icon-font-size: 12px;
      --_ch-steps-gap: 4px;
      display: flex;
      width: 100%;
      font-family: inherit;
      box-sizing: border-box;
    }

    .ch-steps *,
    .ch-steps *::before,
    .ch-steps *::after {
      box-sizing: border-box;
    }

    .ch-steps--sm {
      --_ch-steps-icon-size: 20px;
      --_ch-steps-icon-font-size: 11px;
    }

    .ch-steps--horizontal {
      flex-direction: row;
    }

    .ch-steps--vertical {
      flex-direction: column;
    }

    .ch-steps__item {
      position: relative;
      cursor: pointer;
    }

    .ch-steps--horizontal .ch-steps__item {
      flex: 1 1 0%;
    }

    .ch-steps--vertical .ch-steps__item {
      flex: none;
    }

    .ch-steps__item-container {
      display: flex;
      align-items: flex-start;
    }

    .ch-steps--horizontal .ch-steps__item-container {
      flex-direction: row;
    }

    .ch-steps--horizontal.ch-steps--label-vertical .ch-steps__item-container {
      flex-direction: column;
      align-items: center;
    }

    .ch-steps--vertical .ch-steps__item-container {
      flex-direction: row;
    }

    .ch-steps__icon-wrapper {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      position: relative;
    }

    .ch-steps--horizontal .ch-steps__icon-wrapper {
      flex-direction: row;
      width: 100%;
    }

    .ch-steps--horizontal.ch-steps--label-vertical .ch-steps__icon-wrapper {
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }

    .ch-steps--vertical .ch-steps__icon-wrapper {
      flex-direction: column;
      align-items: center;
      min-height: 100%;
    }

    .ch-steps__icon {
      width: var(--_ch-steps-icon-size);
      height: var(--_ch-steps-icon-size);
      min-width: var(--_ch-steps-icon-size);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--_ch-steps-icon-font-size);
      font-weight: 600;
      line-height: 1;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
      flex-shrink: 0;
      z-index: 1;
    }

    .ch-steps__item--wait .ch-steps__icon {
      background-color: var(--ch-border, #d9d9d9);
      color: var(--ch-text-secondary, #8c8c8c);
    }

    .ch-steps__item--process .ch-steps__icon {
      background-color: var(--ch-primary, #1677ff);
      color: #fff;
    }

    .ch-steps__item--finish .ch-steps__icon {
      background-color: var(--ch-primary, #1677ff);
      color: #fff;
    }

    .ch-steps__item--error .ch-steps__icon {
      background-color: var(--ch-error, #ff4d4f);
      color: #fff;
    }

    .ch-steps__icon-svg {
      width: 14px;
      height: 14px;
    }

    .ch-steps--sm .ch-steps__icon-svg {
      width: 12px;
      height: 12px;
    }

    .ch-steps__custom-icon {
      font-size: var(--_ch-steps-icon-font-size);
    }

    .ch-steps__connector {
      transition: background-color 0.2s;
    }

    .ch-steps--horizontal .ch-steps__connector {
      flex: 1 1 0%;
      height: 1px;
      background-color: var(--ch-border, #d9d9d9);
      margin: 0 8px;
      align-self: center;
    }

    .ch-steps--vertical .ch-steps__connector {
      width: 1px;
      flex: 1 1 0%;
      min-height: 24px;
      background-color: var(--ch-border, #d9d9d9);
      margin: var(--_ch-steps-gap) 0;
    }

    .ch-steps__connector--finished {
      background-color: var(--ch-primary, #1677ff) !important;
    }

    .ch-steps__content {
      margin-left: 8px;
      padding-bottom: 4px;
    }

    .ch-steps--horizontal.ch-steps--label-vertical .ch-steps__content {
      margin-left: 0;
      margin-top: 8px;
      text-align: center;
    }

    .ch-steps--vertical .ch-steps__content {
      margin-left: 8px;
      padding-bottom: 16px;
    }

    .ch-steps__title {
      font-size: 14px;
      font-weight: 600;
      line-height: var(--_ch-steps-icon-size);
      color: var(--ch-text, #000000d9);
      transition: color 0.2s;
      white-space: nowrap;
    }

    .ch-steps__item--wait .ch-steps__title {
      color: var(--ch-text-secondary, #8c8c8c);
    }

    .ch-steps__item--process .ch-steps__title {
      color: var(--ch-primary, #1677ff);
    }

    .ch-steps__item--error .ch-steps__title {
      color: var(--ch-error, #ff4d4f);
    }

    .ch-steps--sm .ch-steps__title {
      font-size: 13px;
    }

    .ch-steps__description {
      font-size: 12px;
      color: var(--ch-text-secondary, #8c8c8c);
      margin-top: 2px;
      line-height: 1.4;
      white-space: normal;
    }

    .ch-steps--sm .ch-steps__description {
      font-size: 11px;
    }
  `],
})
export class StepsComponent {
  @Input() items: StepItem[] = [];
  @Input() current: number = 0;
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() size: 'sm' | 'default' = 'default';
  @Input() labelPlacement: 'horizontal' | 'vertical' = 'horizontal';

  @Output() currentChange = new EventEmitter<number>();

  getStatus(index: number): 'wait' | 'process' | 'finish' | 'error' {
    const item = this.items[index];
    if (item?.status) {
      return item.status;
    }
    if (index < this.current) {
      return 'finish';
    }
    if (index === this.current) {
      return 'process';
    }
    return 'wait';
  }

  onStepClick(index: number): void {
    if (index !== this.current) {
      this.currentChange.emit(index);
    }
  }
}
