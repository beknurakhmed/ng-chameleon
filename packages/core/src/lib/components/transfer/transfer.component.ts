import {
  Component, Input, Output, EventEmitter, signal, computed,
  ChangeDetectionStrategy, ViewEncapsulation, forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChTransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ch-transfer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChTransferComponent), multi: true }],
  template: `
    <div class="ch-transfer">
      <!-- Source Panel -->
      <div class="ch-transfer__panel">
        <div class="ch-transfer__header">
          <label class="ch-transfer__check-all">
            <input type="checkbox" [checked]="allSourceChecked()" (change)="toggleAllSource()" />
            <span>{{ sourceChecked().size }}/{{ sourceItems().length }}</span>
          </label>
          <span class="ch-transfer__header-title">{{ sourceTitle }}</span>
        </div>
        <div class="ch-transfer__search" *ngIf="showSearch">
          <input class="ch-transfer__search-input" placeholder="Search..."
                 [value]="sourceFilter()" (input)="sourceFilter.set(asInputValue($event))" />
        </div>
        <ul class="ch-transfer__list">
          @for (item of filteredSource(); track item.key) {
            <li class="ch-transfer__item" [class.ch-transfer__item--disabled]="item.disabled">
              <label class="ch-transfer__item-label">
                <input type="checkbox" [checked]="sourceChecked().has(item.key)"
                       [disabled]="item.disabled" (change)="toggleSourceItem(item.key)" />
                <span class="ch-transfer__item-text">{{ item.title }}</span>
              </label>
            </li>
          } @empty {
            <li class="ch-transfer__empty">No data</li>
          }
        </ul>
      </div>

      <!-- Actions -->
      <div class="ch-transfer__actions">
        <button class="ch-transfer__move-btn" [disabled]="sourceChecked().size === 0" (click)="moveToTarget()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="ch-transfer__move-btn" [disabled]="targetChecked().size === 0" (click)="moveToSource()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <!-- Target Panel -->
      <div class="ch-transfer__panel">
        <div class="ch-transfer__header">
          <label class="ch-transfer__check-all">
            <input type="checkbox" [checked]="allTargetChecked()" (change)="toggleAllTarget()" />
            <span>{{ targetChecked().size }}/{{ targetItems().length }}</span>
          </label>
          <span class="ch-transfer__header-title">{{ targetTitle }}</span>
        </div>
        <div class="ch-transfer__search" *ngIf="showSearch">
          <input class="ch-transfer__search-input" placeholder="Search..."
                 [value]="targetFilter()" (input)="targetFilter.set(asInputValue($event))" />
        </div>
        <ul class="ch-transfer__list">
          @for (item of filteredTarget(); track item.key) {
            <li class="ch-transfer__item" [class.ch-transfer__item--disabled]="item.disabled">
              <label class="ch-transfer__item-label">
                <input type="checkbox" [checked]="targetChecked().has(item.key)"
                       [disabled]="item.disabled" (change)="toggleTargetItem(item.key)" />
                <span class="ch-transfer__item-text">{{ item.title }}</span>
              </label>
            </li>
          } @empty {
            <li class="ch-transfer__empty">No data</li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .ch-transfer { display: flex; align-items: stretch; gap: 8px; }
    .ch-transfer__panel {
      flex: 1; min-width: 200px; border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-lg, 8px); overflow: hidden;
      display: flex; flex-direction: column; max-height: 400px;
    }
    .ch-transfer__header {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px;
      background: var(--ch-bg-subtle); border-bottom: 1px solid var(--ch-border);
      font-size: var(--ch-text-sm); color: var(--ch-text);
    }
    .ch-transfer__check-all { display: flex; align-items: center; gap: 6px; font-size: var(--ch-text-xs); color: var(--ch-text-muted); cursor: pointer; }
    .ch-transfer__header-title { font-weight: var(--ch-weight-medium, 500); }
    .ch-transfer__search { padding: 8px; border-bottom: 1px solid var(--ch-border); }
    .ch-transfer__search-input {
      width: 100%; padding: 4px 8px; border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-sm); font-size: var(--ch-text-sm);
      background: var(--ch-input-bg, var(--ch-bg)); color: var(--ch-text);
      outline: none;
    }
    .ch-transfer__search-input:focus { border-color: var(--ch-primary); }
    .ch-transfer__list {
      list-style: none; margin: 0; padding: 4px 0; overflow-y: auto; flex: 1;
    }
    .ch-transfer__item { padding: 0; }
    .ch-transfer__item-label {
      display: flex; align-items: center; gap: 8px; padding: 6px 12px;
      cursor: pointer; font-size: var(--ch-text-sm); color: var(--ch-text);
      transition: background 0.15s;
    }
    .ch-transfer__item-label:hover { background: var(--ch-bg-subtle); }
    .ch-transfer__item--disabled .ch-transfer__item-label {
      cursor: not-allowed; opacity: 0.5;
    }
    .ch-transfer__empty {
      padding: 24px; text-align: center; color: var(--ch-text-muted);
      font-size: var(--ch-text-sm);
    }
    .ch-transfer__actions {
      display: flex; flex-direction: column; justify-content: center; gap: 8px;
    }
    .ch-transfer__move-btn {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border: 1px solid var(--ch-border);
      border-radius: var(--ch-radius-sm); background: var(--ch-bg);
      color: var(--ch-text); cursor: pointer; transition: all 0.15s;
    }
    .ch-transfer__move-btn:hover:not(:disabled) {
      border-color: var(--ch-primary); color: var(--ch-primary); background: var(--ch-primary-subtle);
    }
    .ch-transfer__move-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ChTransferComponent implements ControlValueAccessor {
  @Input() dataSource: ChTransferItem[] = [];
  @Input() sourceTitle = 'Source';
  @Input() targetTitle = 'Target';
  @Input() showSearch = false;
  @Output() transferChange = new EventEmitter<string[]>();

  targetKeys = signal<Set<string>>(new Set());
  sourceChecked = signal<Set<string>>(new Set());
  targetChecked = signal<Set<string>>(new Set());
  sourceFilter = signal('');
  targetFilter = signal('');

  sourceItems = computed(() =>
    this.dataSource.filter(i => !this.targetKeys().has(i.key))
  );
  targetItems = computed(() =>
    this.dataSource.filter(i => this.targetKeys().has(i.key))
  );
  filteredSource = computed(() => {
    const f = this.sourceFilter().toLowerCase();
    return f ? this.sourceItems().filter(i => i.title.toLowerCase().includes(f)) : this.sourceItems();
  });
  filteredTarget = computed(() => {
    const f = this.targetFilter().toLowerCase();
    return f ? this.targetItems().filter(i => i.title.toLowerCase().includes(f)) : this.targetItems();
  });
  allSourceChecked = computed(() => {
    const items = this.sourceItems().filter(i => !i.disabled);
    return items.length > 0 && items.every(i => this.sourceChecked().has(i.key));
  });
  allTargetChecked = computed(() => {
    const items = this.targetItems().filter(i => !i.disabled);
    return items.length > 0 && items.every(i => this.targetChecked().has(i.key));
  });

  private onChange: (v: string[]) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string[]) { if (v) this.targetKeys.set(new Set(v)); }
  registerOnChange(fn: (v: string[]) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }

  asInputValue(e: Event): string { return (e.target as HTMLInputElement).value; }

  toggleSourceItem(key: string) {
    this.sourceChecked.update(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  toggleTargetItem(key: string) {
    this.targetChecked.update(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  toggleAllSource() {
    const items = this.sourceItems().filter(i => !i.disabled);
    this.sourceChecked.set(this.allSourceChecked() ? new Set() : new Set(items.map(i => i.key)));
  }
  toggleAllTarget() {
    const items = this.targetItems().filter(i => !i.disabled);
    this.targetChecked.set(this.allTargetChecked() ? new Set() : new Set(items.map(i => i.key)));
  }

  moveToTarget() {
    this.targetKeys.update(s => { const n = new Set(s); this.sourceChecked().forEach(k => n.add(k)); return n; });
    this.sourceChecked.set(new Set());
    this.emitChange();
  }
  moveToSource() {
    this.targetKeys.update(s => { const n = new Set(s); this.targetChecked().forEach(k => n.delete(k)); return n; });
    this.targetChecked.set(new Set());
    this.emitChange();
  }

  private emitChange() {
    const keys = Array.from(this.targetKeys());
    this.onChange(keys);
    this.transferChange.emit(keys);
    this.onTouched();
  }
}
