import {
  Component, Input, Output, EventEmitter, signal, computed,
  ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy,
  ContentChildren, QueryList, AfterContentInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-anchor-link',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a class="ch-anchor__link"
       [class.ch-anchor__link--active]="active()"
       [href]="href"
       (click)="onClick($event)">
      {{ title }}
    </a>
    <ng-content></ng-content>
  `,
  styles: [`
    :host { display: block; }
    .ch-anchor__link {
      display: block; padding: 4px 0 4px 12px;
      font-size: var(--ch-text-sm); color: var(--ch-text-subtle);
      text-decoration: none; transition: color var(--ch-transition-fast, 150ms ease);
      border-left: 2px solid transparent; margin-left: -2px;
    }
    .ch-anchor__link:hover { color: var(--ch-text); }
    .ch-anchor__link--active {
      color: var(--ch-primary); border-left-color: var(--ch-primary);
      font-weight: var(--ch-weight-medium, 500);
    }
  `]
})
export class ChAnchorLinkComponent {
  @Input() href = '';
  @Input() title = '';
  active = signal(false);

  onClick(e: Event) {
    e.preventDefault();
    const id = this.href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

@Component({
  selector: 'ch-anchor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-anchor" [class.ch-anchor--fixed]="affix">
      <div class="ch-anchor__ink">
        <div class="ch-anchor__ink-indicator" [style.top.px]="indicatorTop()" [style.opacity]="indicatorTop() >= 0 ? 1 : 0"></div>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .ch-anchor {
      position: relative; padding-left: 2px;
    }
    .ch-anchor--fixed { position: fixed; }
    .ch-anchor__ink {
      position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
      background: var(--ch-border, #e5e7eb);
    }
    .ch-anchor__ink-indicator {
      position: absolute; left: 0; width: 2px; height: 20px;
      background: var(--ch-primary); border-radius: 1px;
      transition: top 0.2s ease, opacity 0.2s ease;
    }
  `]
})
export class ChAnchorComponent implements AfterContentInit, OnDestroy {
  @Input() affix = false;
  @Input() offsetTop = 0;
  @Input() bounds = 5;
  @Output() anchorChange = new EventEmitter<string>();

  @ContentChildren(ChAnchorLinkComponent) links!: QueryList<ChAnchorLinkComponent>;

  indicatorTop = signal(-1);
  private observer?: IntersectionObserver;
  private scrollHandler?: () => void;

  ngAfterContentInit() {
    this.scrollHandler = () => this.updateActive();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    setTimeout(() => this.updateActive(), 100);
  }

  ngOnDestroy() {
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    this.observer?.disconnect();
  }

  private updateActive() {
    if (!this.links) return;
    const linksArr = this.links.toArray();
    let activeIdx = -1;
    let minDist = Infinity;

    linksArr.forEach((link, i) => {
      const id = link.href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - this.offsetTop - this.bounds);
        if (rect.top <= this.offsetTop + this.bounds + 100 && dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      }
    });

    linksArr.forEach((link, i) => {
      link.active.set(i === activeIdx);
    });

    if (activeIdx >= 0) {
      this.indicatorTop.set(activeIdx * 28 + 6);
      this.anchorChange.emit(linksArr[activeIdx].href);
    }
  }
}
