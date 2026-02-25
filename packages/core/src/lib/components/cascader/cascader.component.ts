import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChCascaderOption { value: string; label: string; children?: ChCascaderOption[]; disabled?: boolean; }

@Component({
  selector: 'ch-cascader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChCascaderComponent), multi: true }],
  host: {'(document:click)':'onDocClick($event)'},
  template: `
    <div class="ch-cascader" [class.ch-cascader--open]="isOpen()" [class.ch-cascader--disabled]="disabled">
      <div class="ch-cascader__input" (click)="toggle()">
        <span class="ch-cascader__label" *ngIf="displayLabel()">{{ displayLabel() }}</span>
        <span class="ch-cascader__placeholder" *ngIf="!displayLabel()">{{ placeholder }}</span>
        <svg class="ch-cascader__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      @if (isOpen()) {
        <div class="ch-cascader__dropdown">
          <div class="ch-cascader__menus">
            @for (menu of menus(); track $index) {
              <ul class="ch-cascader__menu">
                @for (opt of menu; track opt.value) {
                  <li class="ch-cascader__option"
                      [class.ch-cascader__option--active]="isActive($index, opt.value)"
                      [class.ch-cascader__option--disabled]="opt.disabled"
                      (click)="selectOption($index, opt)">
                    <span>{{ opt.label }}</span>
                    <svg *ngIf="opt.children?.length" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-cascader{position:relative;display:inline-block;min-width:200px}
    .ch-cascader__input{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;border:1px solid var(--ch-border);border-radius:var(--ch-input-radius,var(--ch-radius-md));background:var(--ch-input-bg,var(--ch-bg));cursor:pointer;transition:border-color .15s;min-height:var(--ch-input-height-md,2.5rem);gap:8px}
    .ch-cascader__input:hover{border-color:var(--ch-input-hover-border,var(--ch-border))}
    .ch-cascader--open .ch-cascader__input{border-color:var(--ch-primary);box-shadow:var(--ch-input-ring,none)}
    .ch-cascader--disabled .ch-cascader__input{opacity:.5;cursor:not-allowed}
    .ch-cascader__label{font-size:var(--ch-text-sm);color:var(--ch-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ch-cascader__placeholder{font-size:var(--ch-text-sm);color:var(--ch-text-muted)}
    .ch-cascader__arrow{flex-shrink:0;color:var(--ch-text-muted);transition:transform .2s}
    .ch-cascader--open .ch-cascader__arrow{transform:rotate(180deg)}
    .ch-cascader__dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:var(--ch-z-dropdown);background:var(--ch-bg-elevated);border:1px solid var(--ch-border);border-radius:var(--ch-radius-lg);box-shadow:var(--ch-shadow-lg);overflow:hidden}
    .ch-cascader__menus{display:flex}
    .ch-cascader__menu{list-style:none;margin:0;padding:4px 0;min-width:120px;max-height:256px;overflow-y:auto;border-right:1px solid var(--ch-border)}
    .ch-cascader__menu:last-child{border-right:none}
    .ch-cascader__option{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;font-size:var(--ch-text-sm);color:var(--ch-text);cursor:pointer;transition:background .1s;gap:8px}
    .ch-cascader__option:hover{background:var(--ch-bg-subtle)}
    .ch-cascader__option--active{background:var(--ch-primary-subtle);color:var(--ch-primary);font-weight:var(--ch-weight-medium)}
    .ch-cascader__option--disabled{opacity:.5;cursor:not-allowed}
  `]
})
export class ChCascaderComponent implements ControlValueAccessor {
  @Input() options: ChCascaderOption[] = [];
  @Input() placeholder = 'Please select';
  @Input() disabled = false;
  @Input() separator = ' / ';
  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = signal(false);
  selectedPath = signal<string[]>([]);
  activeOptions = signal<ChCascaderOption[][]>([]);

  menus = computed(() => {
    const result: ChCascaderOption[][] = [this.options];
    const path = this.selectedPath();
    let current = this.options;
    for (const val of path) {
      const found = current.find(o => o.value === val);
      if (found?.children?.length) { result.push(found.children); current = found.children; } else break;
    }
    return result;
  });

  displayLabel = computed(() => {
    const path = this.selectedPath();
    if (!path.length) return '';
    const labels: string[] = [];
    let current = this.options;
    for (const val of path) {
      const found = current.find(o => o.value === val);
      if (found) { labels.push(found.label); current = found.children || []; }
    }
    return labels.join(this.separator);
  });

  private fn: (v: string[]) => void = () => {};
  private touched: () => void = () => {};
  constructor(private elRef: ElementRef) {}
  writeValue(v: string[]) { if (v) this.selectedPath.set(v); }
  registerOnChange(f: (v: string[]) => void) { this.fn = f; }
  registerOnTouched(f: () => void) { this.touched = f; }

  toggle() { if (!this.disabled) this.isOpen.update(v => !v); }
  onDocClick(e: Event) { if (!this.elRef.nativeElement.contains(e.target)) this.isOpen.set(false); }

  isActive(level: number, value: string): boolean { return this.selectedPath()[level] === value; }

  selectOption(level: number, opt: ChCascaderOption) {
    if (opt.disabled) return;
    const path = this.selectedPath().slice(0, level);
    path.push(opt.value);
    this.selectedPath.set(path);
    if (!opt.children?.length) {
      this.isOpen.set(false);
      this.fn(path);
      this.selectionChange.emit(path);
      this.touched();
    }
  }
}
