import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChMentionOption { value: string; label: string; avatar?: string; }

@Component({
  selector: 'ch-mentions',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChMentionsComponent), multi: true }],
  template: `
    <div class="ch-mentions" [class.ch-mentions--focused]="focused()">
      <textarea #textareaRef class="ch-mentions__input"
                [rows]="rows" [placeholder]="placeholder" [disabled]="disabled"
                [value]="value()"
                (input)="onInput($event)"
                (keydown)="onKeydown($event)"
                (focus)="focused.set(true)"
                (blur)="onBlur()"></textarea>
      @if (showDropdown()) {
        <ul class="ch-mentions__dropdown" [style.left.px]="dropLeft()">
          @for (opt of filtered(); track opt.value; let i = $index) {
            <li class="ch-mentions__option" [class.ch-mentions__option--active]="i===activeIdx()"
                (mousedown)="selectOption(opt)">
              <img *ngIf="opt.avatar" [src]="opt.avatar" class="ch-mentions__avatar"/>
              <span>{{ opt.label }}</span>
            </li>
          } @empty {
            <li class="ch-mentions__empty">No matches</li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .ch-mentions{position:relative;display:block}
    .ch-mentions__input{width:100%;padding:8px 12px;border:1px solid var(--ch-border);border-radius:var(--ch-input-radius,var(--ch-radius-md));background:var(--ch-input-bg,var(--ch-bg));color:var(--ch-text);font-size:var(--ch-text-sm);font-family:inherit;resize:vertical;outline:none;transition:border-color .15s}
    .ch-mentions--focused .ch-mentions__input{border-color:var(--ch-primary);box-shadow:var(--ch-input-ring,none)}
    .ch-mentions__dropdown{position:absolute;bottom:auto;z-index:var(--ch-z-dropdown);min-width:160px;max-height:200px;overflow-y:auto;list-style:none;margin:0;padding:4px 0;background:var(--ch-bg-elevated);border:1px solid var(--ch-border);border-radius:var(--ch-radius-md);box-shadow:var(--ch-shadow-lg)}
    .ch-mentions__option{display:flex;align-items:center;gap:8px;padding:6px 12px;font-size:var(--ch-text-sm);color:var(--ch-text);cursor:pointer;transition:background .1s}
    .ch-mentions__option:hover,.ch-mentions__option--active{background:var(--ch-bg-subtle)}
    .ch-mentions__avatar{width:20px;height:20px;border-radius:50%;object-fit:cover}
    .ch-mentions__empty{padding:8px 12px;font-size:var(--ch-text-sm);color:var(--ch-text-muted);text-align:center}
  `]
})
export class ChMentionsComponent implements ControlValueAccessor {
  @Input() options: ChMentionOption[] = [];
  @Input() trigger = '@';
  @Input() placeholder = '';
  @Input() rows = 3;
  @Input() disabled = false;
  @Output() mentionSelect = new EventEmitter<ChMentionOption>();
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;

  value = signal('');
  focused = signal(false);
  showDropdown = signal(false);
  searchText = signal('');
  activeIdx = signal(0);
  dropLeft = signal(0);

  filtered = computed(() => {
    const s = this.searchText().toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(s));
  });

  private mentionStart = -1;
  private fn: (v: string) => void = () => {};
  private touched: () => void = () => {};
  writeValue(v: string) { if (v != null) this.value.set(v); }
  registerOnChange(f: (v: string) => void) { this.fn = f; }
  registerOnTouched(f: () => void) { this.touched = f; }

  onInput(e: Event) {
    const ta = e.target as HTMLTextAreaElement;
    this.value.set(ta.value);
    this.fn(ta.value);
    const pos = ta.selectionStart || 0;
    const before = ta.value.slice(0, pos);
    const trigIdx = before.lastIndexOf(this.trigger);
    if (trigIdx >= 0 && (trigIdx === 0 || before[trigIdx - 1] === ' ' || before[trigIdx - 1] === '\n')) {
      const query = before.slice(trigIdx + this.trigger.length);
      if (!/\s/.test(query)) {
        this.mentionStart = trigIdx;
        this.searchText.set(query);
        this.activeIdx.set(0);
        this.showDropdown.set(true);
        return;
      }
    }
    this.showDropdown.set(false);
  }

  onKeydown(e: KeyboardEvent) {
    if (!this.showDropdown()) return;
    const f = this.filtered();
    if (e.key === 'ArrowDown') { e.preventDefault(); this.activeIdx.set((this.activeIdx() + 1) % f.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.activeIdx.set((this.activeIdx() - 1 + f.length) % f.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (f[this.activeIdx()]) this.selectOption(f[this.activeIdx()]); }
    else if (e.key === 'Escape') { this.showDropdown.set(false); }
  }

  selectOption(opt: ChMentionOption) {
    const ta = this.textareaRef.nativeElement;
    const pos = ta.selectionStart || 0;
    const before = this.value().slice(0, this.mentionStart);
    const after = this.value().slice(pos);
    const inserted = this.trigger + opt.value + ' ';
    this.value.set(before + inserted + after);
    this.fn(this.value());
    this.showDropdown.set(false);
    this.mentionSelect.emit(opt);
    setTimeout(() => { const np = before.length + inserted.length; ta.setSelectionRange(np, np); ta.focus(); });
  }

  onBlur() { setTimeout(() => { this.focused.set(false); this.showDropdown.set(false); }, 200); this.touched(); }
}
