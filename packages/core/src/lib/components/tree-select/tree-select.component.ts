import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChTreeSelectNode { key: string; title: string; children?: ChTreeSelectNode[]; disabled?: boolean; isLeaf?: boolean; }

@Component({
  selector: 'ch-tree-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChTreeSelectComponent), multi: true }],
  host: {'(document:click)':'onDocClick($event)'},
  template: `
    <div class="ch-tree-select" [class.ch-tree-select--open]="isOpen()" [class.ch-tree-select--disabled]="disabled">
      <div class="ch-tree-select__selector" (click)="toggle()">
        @if (multiple && selectedKeys().length) {
          <div class="ch-tree-select__tags">
            @for (k of selectedKeys(); track k) {
              <span class="ch-tree-select__tag">{{ getTitle(k) }}
                <button class="ch-tree-select__tag-close" (click)="removeKey(k,$event)">&times;</button>
              </span>
            }
          </div>
        } @else if (!multiple && selectedKeys().length) {
          <span class="ch-tree-select__value">{{ getTitle(selectedKeys()[0]) }}</span>
        } @else {
          <span class="ch-tree-select__placeholder">{{ placeholder }}</span>
        }
        <svg class="ch-tree-select__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      @if (isOpen()) {
        <div class="ch-tree-select__dropdown">
          <div class="ch-tree-select__search" *ngIf="showSearch">
            <input class="ch-tree-select__search-input" placeholder="Search..." [value]="filter()" (input)="filter.set(inputVal($event))"/>
          </div>
          <div class="ch-tree-select__tree">
            <ng-container *ngTemplateOutlet="nodesTpl; context:{$implicit: filteredNodes()}"></ng-container>
          </div>
          <ng-template #nodesTpl let-nodes>
            @for (node of nodes; track node.key) {
              <div class="ch-tree-select__node">
                <div class="ch-tree-select__node-content" [style.padding-left.px]="getDepth(node)*20"
                     [class.ch-tree-select__node-content--active]="isSelected(node.key)"
                     [class.ch-tree-select__node-content--disabled]="node.disabled"
                     (click)="selectNode(node)">
                  @if (node.children?.length) {
                    <svg class="ch-tree-select__expand" [class.ch-tree-select__expand--open]="isExpanded(node.key)"
                         (click)="toggleExpand(node.key,$event)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  } @else {
                    <span class="ch-tree-select__leaf-spacer"></span>
                  }
                  @if (multiple) {
                    <input type="checkbox" [checked]="isSelected(node.key)" [disabled]="node.disabled" class="ch-tree-select__checkbox"/>
                  }
                  <span>{{ node.title }}</span>
                </div>
                @if (node.children?.length && isExpanded(node.key)) {
                  <ng-container *ngTemplateOutlet="nodesTpl; context:{$implicit: node.children}"></ng-container>
                }
              </div>
            }
          </ng-template>
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-tree-select{position:relative;display:inline-block;min-width:200px}
    .ch-tree-select__selector{display:flex;align-items:center;justify-content:space-between;min-height:var(--ch-input-height-md,2.5rem);padding:4px 12px;border:1px solid var(--ch-border);border-radius:var(--ch-input-radius,var(--ch-radius-md));background:var(--ch-input-bg,var(--ch-bg));cursor:pointer;transition:border-color .15s;gap:8px}
    .ch-tree-select__selector:hover{border-color:var(--ch-input-hover-border,var(--ch-border))}
    .ch-tree-select--open .ch-tree-select__selector{border-color:var(--ch-primary);box-shadow:var(--ch-input-ring,none)}
    .ch-tree-select--disabled .ch-tree-select__selector{opacity:.5;cursor:not-allowed}
    .ch-tree-select__value{font-size:var(--ch-text-sm);color:var(--ch-text)}
    .ch-tree-select__placeholder{font-size:var(--ch-text-sm);color:var(--ch-text-muted)}
    .ch-tree-select__arrow{flex-shrink:0;color:var(--ch-text-muted);transition:transform .2s}
    .ch-tree-select--open .ch-tree-select__arrow{transform:rotate(180deg)}
    .ch-tree-select__tags{display:flex;flex-wrap:wrap;gap:4px;flex:1}
    .ch-tree-select__tag{display:inline-flex;align-items:center;gap:2px;padding:2px 6px;font-size:var(--ch-text-xs);background:var(--ch-bg-subtle);border:1px solid var(--ch-border);border-radius:var(--ch-radius-sm);color:var(--ch-text)}
    .ch-tree-select__tag-close{background:none;border:none;cursor:pointer;color:var(--ch-text-muted);font-size:14px;line-height:1;padding:0 2px}
    .ch-tree-select__tag-close:hover{color:var(--ch-text)}
    .ch-tree-select__dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:var(--ch-z-dropdown);width:100%;min-width:200px;max-height:300px;overflow-y:auto;background:var(--ch-bg-elevated);border:1px solid var(--ch-border);border-radius:var(--ch-radius-lg);box-shadow:var(--ch-shadow-lg)}
    .ch-tree-select__search{padding:8px;border-bottom:1px solid var(--ch-border)}
    .ch-tree-select__search-input{width:100%;padding:4px 8px;border:1px solid var(--ch-border);border-radius:var(--ch-radius-sm);font-size:var(--ch-text-sm);background:var(--ch-bg);color:var(--ch-text);outline:none}
    .ch-tree-select__search-input:focus{border-color:var(--ch-primary)}
    .ch-tree-select__tree{padding:4px 0}
    .ch-tree-select__node-content{display:flex;align-items:center;gap:6px;padding:5px 12px;font-size:var(--ch-text-sm);color:var(--ch-text);cursor:pointer;transition:background .1s}
    .ch-tree-select__node-content:hover{background:var(--ch-bg-subtle)}
    .ch-tree-select__node-content--active{color:var(--ch-primary);font-weight:var(--ch-weight-medium)}
    .ch-tree-select__node-content--disabled{opacity:.5;cursor:not-allowed}
    .ch-tree-select__expand{flex-shrink:0;transition:transform .15s;cursor:pointer}
    .ch-tree-select__expand--open{transform:rotate(90deg)}
    .ch-tree-select__leaf-spacer{width:12px;flex-shrink:0}
    .ch-tree-select__checkbox{margin:0}
  `]
})
export class ChTreeSelectComponent implements ControlValueAccessor {
  @Input() treeData: ChTreeSelectNode[] = [];
  @Input() placeholder = 'Please select';
  @Input() multiple = false;
  @Input() showSearch = false;
  @Input() disabled = false;
  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = signal(false);
  selectedKeys = signal<string[]>([]);
  expandedKeys = signal<Set<string>>(new Set());
  filter = signal('');

  filteredNodes = computed(() => {
    const f = this.filter().toLowerCase();
    if (!f) return this.treeData;
    return this.filterTree(this.treeData, f);
  });

  private titleMap = new Map<string, string>();
  private depthMap = new Map<string, number>();
  private fn: (v: string | string[]) => void = () => {};
  private touched: () => void = () => {};
  constructor(private elRef: ElementRef) {}

  writeValue(v: string | string[]) {
    if (v) this.selectedKeys.set(Array.isArray(v) ? v : [v]);
  }
  registerOnChange(f: (v: string | string[]) => void) { this.fn = f; }
  registerOnTouched(f: () => void) { this.touched = f; }

  toggle() { if (!this.disabled) { this.isOpen.update(v => !v); if (this.isOpen()) this.buildMaps(this.treeData, 0); } }
  onDocClick(e: Event) { if (!this.elRef.nativeElement.contains(e.target)) this.isOpen.set(false); }
  inputVal(e: Event): string { return (e.target as HTMLInputElement).value; }
  isSelected(key: string): boolean { return this.selectedKeys().includes(key); }
  isExpanded(key: string): boolean { return this.expandedKeys().has(key); }
  getTitle(key: string): string { this.buildMaps(this.treeData, 0); return this.titleMap.get(key) || key; }
  getDepth(node: ChTreeSelectNode): number { return this.depthMap.get(node.key) || 0; }

  toggleExpand(key: string, e: Event) {
    e.stopPropagation();
    this.expandedKeys.update(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  selectNode(node: ChTreeSelectNode) {
    if (node.disabled) return;
    if (this.multiple) {
      this.selectedKeys.update(keys => keys.includes(node.key) ? keys.filter(k => k !== node.key) : [...keys, node.key]);
    } else {
      this.selectedKeys.set([node.key]);
      this.isOpen.set(false);
    }
    const val = this.multiple ? this.selectedKeys() : this.selectedKeys()[0];
    this.fn(val);
    this.selectionChange.emit(this.selectedKeys());
    this.touched();
  }

  removeKey(key: string, e: Event) {
    e.stopPropagation();
    this.selectedKeys.update(keys => keys.filter(k => k !== key));
    this.fn(this.multiple ? this.selectedKeys() : this.selectedKeys()[0]);
    this.selectionChange.emit(this.selectedKeys());
  }

  private buildMaps(nodes: ChTreeSelectNode[], depth: number) {
    for (const n of nodes) {
      this.titleMap.set(n.key, n.title);
      this.depthMap.set(n.key, depth);
      if (n.children) this.buildMaps(n.children, depth + 1);
    }
  }

  private filterTree(nodes: ChTreeSelectNode[], query: string): ChTreeSelectNode[] {
    return nodes.reduce<ChTreeSelectNode[]>((acc, node) => {
      const match = node.title.toLowerCase().includes(query);
      const children = node.children ? this.filterTree(node.children, query) : [];
      if (match || children.length) acc.push({ ...node, children: children.length ? children : node.children });
      return acc;
    }, []);
  }
}
