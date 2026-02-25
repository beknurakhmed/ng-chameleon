import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval as rxInterval, Subject, switchMap, takeUntil, EMPTY } from 'rxjs';

// ---------------------------------------------------------------------------
// ChCarouselSlideComponent
// ---------------------------------------------------------------------------

@Component({
  selector: 'ch-carousel-slide',
  standalone: true,
  template: '<ng-content></ng-content>',
  styles: [
    'ch-carousel-slide { display: block; flex-shrink: 0; width: 100%; box-sizing: border-box; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChCarouselSlideComponent {}

// ---------------------------------------------------------------------------
// ChCarouselComponent
// ---------------------------------------------------------------------------

@Component({
  selector: 'ch-carousel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :root {
        --ch-radius-lg: 12px;
        --ch-carousel-transition-duration: 0.3s;
        --ch-carousel-transition-easing: ease;
      }

      .ch-carousel {
        position: relative;
        overflow: hidden;
        border-radius: var(--ch-radius-lg, 12px);
      }

      .ch-carousel__track {
        display: flex;
        transition: transform var(--ch-carousel-transition-duration, 0.3s)
          var(--ch-carousel-transition-easing, ease);
      }

      .ch-carousel__arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        z-index: 2;
        transition: background 0.2s ease;
      }

      .ch-carousel__arrow:hover {
        background: rgba(0, 0, 0, 0.55);
      }

      .ch-carousel__arrow--prev {
        left: 12px;
      }

      .ch-carousel__arrow--next {
        right: 12px;
      }

      .ch-carousel__arrow svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .ch-carousel__dots {
        position: absolute;
        bottom: 16px;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        z-index: 2;
      }

      .ch-carousel__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .ch-carousel__dot--active {
        background: #fff;
      }
    `,
  ],
  template: `
    <div class="ch-carousel">
      <div
        class="ch-carousel__track"
        [style.transform]="'translateX(-' + activeIndex() * 100 + '%)'">
        <ng-content select="ch-carousel-slide"></ng-content>
      </div>

      <button
        *ngIf="showArrows"
        class="ch-carousel__arrow ch-carousel__arrow--prev"
        type="button"
        aria-label="Previous slide"
        (click)="prev()">
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        *ngIf="showArrows"
        class="ch-carousel__arrow ch-carousel__arrow--next"
        type="button"
        aria-label="Next slide"
        (click)="next()">
        <svg viewBox="0 0 24 24">
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </button>

      <div class="ch-carousel__dots" *ngIf="showDots && slideCount() > 1">
        <button
          *ngFor="let s of dotsArray(); let i = index"
          class="ch-carousel__dot"
          [class.ch-carousel__dot--active]="i === activeIndex()"
          type="button"
          [attr.aria-label]="'Go to slide ' + (i + 1)"
          (click)="goTo(i)">
        </button>
      </div>
    </div>
  `,
})
export class ChCarouselComponent implements AfterContentInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  @Input() autoplay = false;
  @Input() interval = 3000;
  @Input() showDots = true;
  @Input() showArrows = true;
  @Input() loop = true;

  // Outputs
  @Output() slideChange = new EventEmitter<number>();

  // Content children
  @ContentChildren(ChCarouselSlideComponent)
  slides!: QueryList<ChCarouselSlideComponent>;

  // Signals
  readonly activeIndex = signal(0);
  readonly slideCount = signal(0);
  readonly dotsArray = signal<undefined[]>([]);

  // Autoplay internals
  private readonly autoplay$ = new Subject<boolean>();
  private readonly destroy$ = new Subject<void>();

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngAfterContentInit(): void {
    this.updateSlideCount();

    this.slides.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateSlideCount());

    this.autoplay$
      .pipe(
        switchMap((play) =>
          play && this.autoplay
            ? rxInterval(this.interval).pipe(takeUntil(this.destroy$))
            : EMPTY
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.next());

    if (this.autoplay) {
      this.autoplay$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  next(): void {
    const count = this.slideCount();
    if (count === 0) return;

    const current = this.activeIndex();
    if (current < count - 1) {
      this.goTo(current + 1);
    } else if (this.loop) {
      this.goTo(0);
    }
  }

  prev(): void {
    const count = this.slideCount();
    if (count === 0) return;

    const current = this.activeIndex();
    if (current > 0) {
      this.goTo(current - 1);
    } else if (this.loop) {
      this.goTo(count - 1);
    }
  }

  goTo(index: number): void {
    const count = this.slideCount();
    if (count === 0 || index < 0 || index >= count) return;

    this.activeIndex.set(index);
    this.slideChange.emit(index);

    if (this.autoplay) {
      this.autoplay$.next(true);
    }
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private updateSlideCount(): void {
    const count = this.slides ? this.slides.length : 0;
    this.slideCount.set(count);
    this.dotsArray.set(new Array(count));

    if (this.activeIndex() >= count && count > 0) {
      this.activeIndex.set(count - 1);
    }
  }
}
