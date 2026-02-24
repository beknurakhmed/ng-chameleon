import {
  Directive, Input, ElementRef, Renderer2, OnDestroy,
  HostListener, inject, signal,
} from '@angular/core';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[chTooltip]',
  standalone: true,
})
export class ChTooltipDirective implements OnDestroy {
  @Input('chTooltip') text = '';
  @Input() chTooltipPlacement: TooltipPlacement = 'top';
  @Input() chTooltipDelay = 300;

  private readonly el       = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  private _tip: HTMLElement | null = null;
  private _showTimeout?: ReturnType<typeof setTimeout>;
  private _hideTimeout?: ReturnType<typeof setTimeout>;

  @HostListener('mouseenter')
  @HostListener('focusin')
  show(): void {
    if (!this.text) return;
    clearTimeout(this._hideTimeout);
    this._showTimeout = setTimeout(() => this._createTip(), this.chTooltipDelay);
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide(): void {
    clearTimeout(this._showTimeout);
    this._hideTimeout = setTimeout(() => this._destroyTip(), 100);
  }

  private _createTip(): void {
    if (this._tip) return;

    const tip = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(tip, 'ch-tooltip');
    this.renderer.addClass(tip, `ch-tooltip--${this.chTooltipPlacement}`);
    tip.textContent = this.text;
    this.renderer.appendChild(document.body, tip);
    this._tip = tip;

    this._position(tip);

    // Trigger CSS transition
    requestAnimationFrame(() => {
      if (tip) this.renderer.addClass(tip, 'ch-tooltip--visible');
    });
  }

  private _position(tip: HTMLElement): void {
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tipRect  = tip.getBoundingClientRect();
    const gap = 8;

    let top = 0, left = 0;

    switch (this.chTooltipPlacement) {
      case 'top':
        top  = hostRect.top  - tipRect.height - gap + window.scrollY;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
        break;
      case 'bottom':
        top  = hostRect.bottom + gap + window.scrollY;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
        break;
      case 'left':
        top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
        left = hostRect.left - tipRect.width - gap + window.scrollX;
        break;
      case 'right':
        top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
        left = hostRect.right + gap + window.scrollX;
        break;
    }

    this.renderer.setStyle(tip, 'top',  `${top}px`);
    this.renderer.setStyle(tip, 'left', `${left}px`);
  }

  private _destroyTip(): void {
    if (this._tip) {
      this.renderer.removeChild(document.body, this._tip);
      this._tip = null;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    this._destroyTip();
  }
}

// Global tooltip styles — injected via the directive
export const CH_TOOLTIP_STYLES = `
  .ch-tooltip {
    position: absolute;
    z-index: var(--ch-z-tooltip, 9000);
    padding: 4px 10px;
    background: var(--ch-tooltip-bg, #1a202c);
    color: var(--ch-tooltip-color, #fff);
    font-size: var(--ch-text-xs);
    border-radius: var(--ch-radius-md);
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transform: scale(0.95);
    transition: opacity var(--ch-transition-fast), transform var(--ch-transition-fast);

    &--visible {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
