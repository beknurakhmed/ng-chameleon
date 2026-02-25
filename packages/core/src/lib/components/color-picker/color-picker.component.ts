import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ch-color-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChColorPickerComponent), multi: true }],
  template: `
    <div class="ch-color-picker" [class.ch-color-picker--open]="isOpen()">
      <button class="ch-color-picker__trigger" (click)="toggle()" [disabled]="disabled" type="button">
        <span class="ch-color-picker__swatch" [style.background]="color()"></span>
        @if (showText) { <span class="ch-color-picker__value">{{ color() }}</span> }
      </button>
      @if (isOpen()) {
        <div class="ch-color-picker__dropdown" (click)="$event.stopPropagation()">
          <div class="ch-color-picker__panel" #panel (mousedown)="onPanelDown($event)" [style.background]="'hsl('+hue()+',100%,50%)'">
            <div class="ch-color-picker__panel-white"></div>
            <div class="ch-color-picker__panel-black"></div>
            <div class="ch-color-picker__panel-cursor" [style.left.%]="sat()" [style.top.%]="100-bri()"></div>
          </div>
          <div class="ch-color-picker__hue" #hueBar (mousedown)="onHueDown($event)">
            <div class="ch-color-picker__hue-cursor" [style.left.%]="hue()/360*100"></div>
          </div>
          @if (presets.length) {
            <div class="ch-color-picker__presets">
              @for (c of presets; track c) {
                <button class="ch-color-picker__preset" [style.background]="c" [class.active]="c===color()" (click)="pickPreset(c)"></button>
              }
            </div>
          }
          <div class="ch-color-picker__hex-row">
            <span class="ch-color-picker__hash">#</span>
            <input class="ch-color-picker__hex" [value]="hex()" (change)="onHexChange($event)" maxlength="6"/>
          </div>
        </div>
      }
    </div>
  `,
  host: {'(document:click)':'docClick($event)'},
  styles: [`
    .ch-color-picker{position:relative;display:inline-block}
    .ch-color-picker__trigger{display:inline-flex;align-items:center;gap:8px;padding:4px 8px;border:1px solid var(--ch-border);border-radius:var(--ch-radius-md);background:var(--ch-bg);cursor:pointer;transition:border-color .15s}
    .ch-color-picker__trigger:hover{border-color:var(--ch-primary)}
    .ch-color-picker__trigger:disabled{opacity:.5;cursor:not-allowed}
    .ch-color-picker__swatch{display:block;width:24px;height:24px;border-radius:var(--ch-radius-sm);border:1px solid rgba(0,0,0,.1)}
    .ch-color-picker__value{font-size:var(--ch-text-sm);color:var(--ch-text);font-family:var(--ch-font-mono)}
    .ch-color-picker__dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:var(--ch-z-dropdown);width:240px;padding:12px;background:var(--ch-bg-elevated);border:1px solid var(--ch-border);border-radius:var(--ch-radius-lg);box-shadow:var(--ch-shadow-lg)}
    .ch-color-picker__panel{position:relative;width:100%;height:150px;border-radius:var(--ch-radius-sm);cursor:crosshair;overflow:hidden;margin-bottom:10px}
    .ch-color-picker__panel-white{position:absolute;inset:0;background:linear-gradient(to right,#fff,transparent)}
    .ch-color-picker__panel-black{position:absolute;inset:0;background:linear-gradient(to bottom,transparent,#000)}
    .ch-color-picker__panel-cursor{position:absolute;width:12px;height:12px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.6);transform:translate(-50%,-50%);pointer-events:none}
    .ch-color-picker__hue{position:relative;width:100%;height:12px;border-radius:6px;cursor:pointer;margin-bottom:10px;background:linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)}
    .ch-color-picker__hue-cursor{position:absolute;top:-2px;width:16px;height:16px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.4);transform:translateX(-50%);pointer-events:none}
    .ch-color-picker__presets{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
    .ch-color-picker__preset{width:20px;height:20px;border-radius:var(--ch-radius-sm);border:2px solid transparent;cursor:pointer;transition:border-color .15s}
    .ch-color-picker__preset:hover,.ch-color-picker__preset.active{border-color:var(--ch-primary)}
    .ch-color-picker__hex-row{display:flex;align-items:center;gap:4px}
    .ch-color-picker__hash{font-size:var(--ch-text-sm);color:var(--ch-text-muted);font-family:var(--ch-font-mono)}
    .ch-color-picker__hex{flex:1;padding:4px 6px;border:1px solid var(--ch-border);border-radius:var(--ch-radius-sm);font-size:var(--ch-text-sm);font-family:var(--ch-font-mono);color:var(--ch-text);background:var(--ch-bg);outline:none;text-transform:uppercase}
    .ch-color-picker__hex:focus{border-color:var(--ch-primary)}
  `]
})
export class ChColorPickerComponent implements ControlValueAccessor {
  @Input() showText=true; @Input() disabled=false;
  @Input() presets:string[]=['#f44336','#e91e63','#9c27b0','#3f51b5','#2196f3','#00bcd4','#4caf50','#ff9800','#795548','#607d8b'];
  @Output() colorChange=new EventEmitter<string>();
  @ViewChild('panel') panelRef!:ElementRef<HTMLDivElement>;
  @ViewChild('hueBar') hueRef!:ElementRef<HTMLDivElement>;
  color=signal('#1677ff'); isOpen=signal(false);
  hue=signal(217); sat=signal(86); bri=signal(100);
  hex=computed(()=>this.color().replace('#','').toUpperCase());
  private fn:(v:string)=>void=()=>{}; private touched:()=>void=()=>{};
  constructor(private elRef:ElementRef){}
  writeValue(v:string){if(v){this.color.set(v);this.parseHex(v)}} registerOnChange(f:(v:string)=>void){this.fn=f} registerOnTouched(f:()=>void){this.touched=f}
  toggle(){if(!this.disabled)this.isOpen.update(v=>!v)}
  docClick(e:Event){if(!this.elRef.nativeElement.contains(e.target))this.isOpen.set(false)}
  onPanelDown(e:MouseEvent){this.updPanel(e);const m=(ev:MouseEvent)=>this.updPanel(ev),u=()=>{document.removeEventListener('mousemove',m);document.removeEventListener('mouseup',u)};document.addEventListener('mousemove',m);document.addEventListener('mouseup',u)}
  onHueDown(e:MouseEvent){this.updHue(e);const m=(ev:MouseEvent)=>this.updHue(ev),u=()=>{document.removeEventListener('mousemove',m);document.removeEventListener('mouseup',u)};document.addEventListener('mousemove',m);document.addEventListener('mouseup',u)}
  onHexChange(e:Event){const v=(e.target as HTMLInputElement).value.replace(/[^0-9a-fA-F]/g,'');if(v.length===6){this.color.set('#'+v);this.parseHex('#'+v);this.emit()}}
  pickPreset(c:string){this.color.set(c);this.parseHex(c);this.emit()}
  private updPanel(e:MouseEvent){const r=this.panelRef.nativeElement.getBoundingClientRect();this.sat.set(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)));this.bri.set(Math.max(0,Math.min(100,100-(e.clientY-r.top)/r.height*100)));this.updColor()}
  private updHue(e:MouseEvent){const r=this.hueRef.nativeElement.getBoundingClientRect();this.hue.set(Math.max(0,Math.min(360,(e.clientX-r.left)/r.width*360)));this.updColor()}
  private updColor(){this.color.set(this.hsbHex(this.hue(),this.sat(),this.bri()));this.emit()}
  private emit(){this.fn(this.color());this.colorChange.emit(this.color())}
  private hsbHex(h:number,s:number,b:number):string{s/=100;b/=100;const k=(n:number)=>(n+h/60)%6,f=(n:number)=>b*(1-s*Math.max(0,Math.min(k(n),4-k(n),1))),x=(v:number)=>Math.round(v*255).toString(16).padStart(2,'0');return'#'+x(f(5))+x(f(3))+x(f(1))}
  private parseHex(hex:string){const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d+(g<b?6:0))*60;else if(mx===g)h=((b-r)/d+2)*60;else h=((r-g)/d+4)*60}this.hue.set(h);this.sat.set(mx===0?0:d/mx*100);this.bri.set(mx*100)}
}
