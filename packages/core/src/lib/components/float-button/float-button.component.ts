import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-float-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button class="ch-float-btn" [class]="'ch-float-btn ch-float-btn--'+type+' ch-float-btn--'+shape" [attr.data-badge]="badge||null" (click)="btnClick.emit($event)">
      @if (icon) { <span class="ch-float-btn__icon" [innerHTML]="icon"></span> }
      @else { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
      <span class="ch-float-btn__label" *ngIf="label">{{ label }}</span>
    </button>
  `,
  styles: [`
    .ch-float-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all var(--ch-transition-base,.2s ease);box-shadow:var(--ch-shadow-lg);color:var(--ch-primary-fg,#fff);background:var(--ch-primary)}
    .ch-float-btn--circle{width:48px;height:48px;border-radius:50%}
    .ch-float-btn--square{width:48px;height:48px;border-radius:var(--ch-radius-lg,8px)}
    .ch-float-btn--default{background:var(--ch-bg-elevated);color:var(--ch-text);border:1px solid var(--ch-border)}
    .ch-float-btn--primary{background:var(--ch-primary);color:var(--ch-primary-fg)}
    .ch-float-btn:hover{transform:scale(1.05);box-shadow:var(--ch-shadow-xl)}
    .ch-float-btn[data-badge]::after{content:attr(data-badge);position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--ch-error);color:#fff;font-size:11px;line-height:18px;text-align:center}
    .ch-float-btn__icon{display:flex;align-items:center;justify-content:center}
    .ch-float-btn__label{font-size:var(--ch-text-xs);margin-top:2px}
  `]
})
export class ChFloatButtonComponent {
  @Input() type: 'primary' | 'default' = 'primary';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() icon?: string;
  @Input() label?: string;
  @Input() badge?: string;
  @Output() btnClick = new EventEmitter<Event>();
}

@Component({
  selector: 'ch-float-button-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-float-btn-group" [class.ch-float-btn-group--open]="isOpen()" [style]="'bottom:'+bottom+'px;right:'+right+'px;'+(placement==='left'?'right:auto;left:'+right+'px':'')">
      <div class="ch-float-btn-group__list" [class.ch-float-btn-group__list--open]="isOpen()">
        <ng-content></ng-content>
      </div>
      <button class="ch-float-btn ch-float-btn--primary ch-float-btn--circle ch-float-btn-group__trigger" (click)="toggle()">
        <svg [style.transform]="isOpen()?'rotate(45deg)':''" style="transition:transform .2s" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  `,
  styles: [`
    .ch-float-btn-group{position:fixed;z-index:var(--ch-z-fixed,1030);display:flex;flex-direction:column;align-items:center;gap:12px}
    .ch-float-btn-group__list{display:flex;flex-direction:column;align-items:center;gap:8px;overflow:hidden;max-height:0;opacity:0;transition:all .3s ease}
    .ch-float-btn-group__list--open{max-height:500px;opacity:1}
    .ch-float-btn-group__trigger{z-index:1}
  `]
})
export class ChFloatButtonGroupComponent {
  @Input() bottom = 24;
  @Input() right = 24;
  @Input() placement: 'right' | 'left' = 'right';
  isOpen = signal(false);
  toggle() { this.isOpen.set(!this.isOpen()); }
}
