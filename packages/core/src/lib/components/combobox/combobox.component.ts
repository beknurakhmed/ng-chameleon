import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  signal, computed, ViewEncapsulation, forwardRef, OnChanges,
  SimpleChanges, HostListener, ElementRef, ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ComboboxMode = 'single' | 'multi';

export interface ComboboxOption {
  value:      string | number;
  label:      string;
  disabled?:  boolean;
  group?:     string;
  icon?:      string;
}

@Component({
  selector: 'ch-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChComboboxComponent),
    multi:       true,
  }],
  template: `
    <div
      class="ch-combobox"
      [class.ch-combobox--open]="isOpen()"
      [class.ch-combobox--disabled]="disabled"
      [class.ch-combobox--multi]="mode === 'multi'"
    >
      @if (label) {
        <label class="ch-combobox__label" [attr.for]="comboId">{{ label }}</label>
      }

      <!-- Input row -->
      <div
        class="ch-combobox__control"
        [class.ch-combobox__control--focus]="isOpen()"
        [class.ch-combobox__control--error]="!!errorMessage"
        (click)="onControlClick()"
      >
        <!-- Multi-select tags -->
        @if (mode === 'multi') {
          @for (v of selectedValues(); track v) {
            <span class="ch-combobox__tag">
              {{ getLabel(v) }}
              <button
                type="button"
                class="ch-combobox__tag-remove"
                [attr.aria-label]="'Remove ' + getLabel(v)"
                (click)="removeValue(v, $event)"
              >&times;</button>
            </span>
          }
        }

        <!-- Search input -->
        <input
          #inputEl
          class="ch-combobox__input"
          [id]="comboId"
          type="text"
          [placeholder]="inputPlaceholder()"
          [disabled]="disabled"
          [value]="query()"
          (input)="onQueryChange($event)"
          (keydown)="onKeyDown($event)"
          (focus)="open()"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-autocomplete]="'list'"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-label]="label || placeholder"
          autocomplete="off"
          role="combobox"
        />

        <!-- Clear button -->
        @if (hasValue() && clearable) {
          <button
            type="button"
            class="ch-combobox__clear"
            aria-label="Clear selection"
            (click)="clearAll($event)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        }

        <!-- Chevron -->
        <svg
          class="ch-combobox__chevron"
          [class.ch-combobox__chevron--open]="isOpen()"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
        >
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </div>

      @if (errorMessage) {
        <p class="ch-combobox__error">{{ errorMessage }}</p>
      } @else if (helperText) {
        <p class="ch-combobox__helper">{{ helperText }}</p>
      }

      <!-- Dropdown panel -->
      @if (isOpen()) {
        <div
          class="ch-combobox__panel"
          role="listbox"
          [attr.aria-multiselectable]="mode === 'multi'"
          [attr.aria-label]="label || placeholder"
        >
          @if (filteredGroups().length > 0) {
            @for (group of filteredGroups(); track group.name) {
              @if (group.name) {
                <div class="ch-combobox__group-label">{{ group.name }}</div>
              }
              @for (opt of group.options; track opt.value) {
                <div
                  class="ch-combobox__option"
                  [class.ch-combobox__option--selected]="isSelected(opt.value)"
                  [class.ch-combobox__option--focused]="focusedIndex() === getOptionIndex(opt)"
                  [class.ch-combobox__option--disabled]="opt.disabled"
                  role="option"
                  [attr.aria-selected]="isSelected(opt.value)"
                  [attr.aria-disabled]="opt.disabled || null"
                  (click)="selectOption(opt, $event)"
                  (mouseenter)="focusedIndex.set(getOptionIndex(opt))"
                >
                  @if (opt.icon) {
                    <span class="ch-combobox__option-icon" [innerHTML]="opt.icon" aria-hidden="true"></span>
                  }
                  <span class="ch-combobox__option-label">{{ opt.label }}</span>
                  @if (isSelected(opt.value)) {
                    <svg class="ch-combobox__option-check" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <path d="M2 7l3.5 3.5L12 3"/>
                    </svg>
                  }
                </div>
              }
            }
          } @else {
            <div class="ch-combobox__empty">{{ emptyText }}</div>
          }

          <!-- Async loading indicator -->
          @if (loading) {
            <div class="ch-combobox__loading">
              <div class="ch-combobox__spinner"></div>
              {{ loadingText }}
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .ch-combobox {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 200px;
    }

    .ch-combobox__label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--ch-text, #1a202c);
    }

    /* Control */
    .ch-combobox__control {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.25rem;
      padding: 0.375rem 0.625rem;
      border: 1.5px solid var(--ch-border, #e2e8f0);
      border-radius: var(--ch-radius-md, 0.5rem);
      background: var(--ch-bg, #fff);
      cursor: text;
      min-height: 40px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .ch-combobox__control:hover { border-color: var(--ch-border-strong, #a0aec0); }
    .ch-combobox__control--focus {
      border-color: var(--ch-primary, #4f46e5);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ch-primary, #4f46e5) 20%, transparent);
    }
    .ch-combobox__control--error { border-color: var(--ch-error, #e53e3e); }

    /* Tags (multi-select) */
    .ch-combobox__tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.5rem;
      background: color-mix(in srgb, var(--ch-primary, #4f46e5) 12%, transparent);
      color: var(--ch-primary, #4f46e5);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
    }
    .ch-combobox__tag-remove {
      border: none;
      background: none;
      cursor: pointer;
      color: inherit;
      font-size: 1rem;
      line-height: 1;
      padding: 0;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      opacity: 0.7;
    }
    .ch-combobox__tag-remove:hover { opacity: 1; background: color-mix(in srgb, var(--ch-primary, #4f46e5) 20%, transparent); }

    /* Input */
    .ch-combobox__input {
      flex: 1;
      min-width: 60px;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
      padding: 0.125rem 0;
    }
    .ch-combobox__input::placeholder { color: var(--ch-text-muted, #a0aec0); }
    .ch-combobox__input:disabled { cursor: not-allowed; }

    /* Icons */
    .ch-combobox__clear {
      border: none;
      background: none;
      cursor: pointer;
      color: var(--ch-text-muted, #a0aec0);
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: 50%;
      transition: color 0.1s, background 0.1s;
    }
    .ch-combobox__clear:hover { color: var(--ch-text, #1a202c); background: var(--ch-bg-subtle, #f7fafc); }

    .ch-combobox__chevron {
      color: var(--ch-text-muted, #a0aec0);
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .ch-combobox__chevron--open { transform: rotate(180deg); }

    /* Panel */
    .ch-combobox__panel {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      z-index: 250;
      background: var(--ch-bg, #fff);
      border: 1.5px solid var(--ch-border, #e2e8f0);
      border-radius: var(--ch-radius-md, 0.5rem);
      box-shadow: var(--ch-shadow-md, 0 4px 16px rgba(0,0,0,0.12));
      max-height: 260px;
      overflow-y: auto;
      padding: 0.25rem;
      animation: ch-combo-in 0.1s ease;
    }
    @keyframes ch-combo-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Group label */
    .ch-combobox__group-label {
      padding: 0.375rem 0.75rem 0.125rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ch-text-muted, #a0aec0);
    }

    /* Options */
    .ch-combobox__option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4375rem 0.75rem;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--ch-text, #1a202c);
      transition: background 0.1s;
    }
    .ch-combobox__option:hover:not(.ch-combobox__option--disabled),
    .ch-combobox__option--focused:not(.ch-combobox__option--disabled) {
      background: var(--ch-bg-subtle, #f7fafc);
    }
    .ch-combobox__option--selected {
      background: color-mix(in srgb, var(--ch-primary, #4f46e5) 8%, transparent);
      color: var(--ch-primary, #4f46e5);
      font-weight: 500;
    }
    .ch-combobox__option--disabled { opacity: 0.4; cursor: not-allowed; }

    .ch-combobox__option-icon { width: 16px; height: 16px; flex-shrink: 0; display: flex; align-items: center; }
    .ch-combobox__option-label { flex: 1; }
    .ch-combobox__option-check { color: var(--ch-primary, #4f46e5); flex-shrink: 0; }

    /* Empty / loading */
    .ch-combobox__empty,
    .ch-combobox__loading {
      padding: 1rem 0.75rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--ch-text-muted, #a0aec0);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .ch-combobox__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--ch-border, #e2e8f0);
      border-top-color: var(--ch-primary, #4f46e5);
      border-radius: 50%;
      animation: ch-combo-spin 0.6s linear infinite;
    }
    @keyframes ch-combo-spin { to { transform: rotate(360deg); } }

    /* Helpers */
    .ch-combobox__error  { font-size: 0.75rem; color: var(--ch-error, #e53e3e); margin: 0; }
    .ch-combobox__helper { font-size: 0.75rem; color: var(--ch-text-muted, #a0aec0); margin: 0; }

    /* Disabled host */
    .ch-combobox--disabled .ch-combobox__control { opacity: 0.5; pointer-events: none; }
  `],
})
export class ChComboboxComponent implements OnChanges, ControlValueAccessor {

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() options:      ComboboxOption[] = [];
  @Input() mode:         ComboboxMode     = 'single';
  @Input() placeholder   = 'Search...';
  @Input() label?:       string;
  @Input() helperText?:  string;
  @Input() errorMessage?: string;
  @Input() disabled      = false;
  @Input() clearable     = true;
  @Input() loading       = false;
  @Input() loadingText   = 'Loading...';
  @Input() emptyText     = 'No results found';
  @Input() comboId       = `ch-combobox-${Math.random().toString(36).slice(2, 7)}`;

  @Output() valueChange   = new EventEmitter<string | number | Array<string | number> | null>();
  @Output() queryChange   = new EventEmitter<string>();
  @Output() opened        = new EventEmitter<void>();
  @Output() closed        = new EventEmitter<void>();

  readonly isOpen        = signal(false);
  readonly query         = signal('');
  readonly focusedIndex  = signal(-1);

  private _singleValue   = signal<string | number | null>(null);
  private _multiValues   = signal<Array<string | number>>([]);

  private _onChange      = (_: string | number | Array<string | number> | null) => {};
  private _onTouched     = () => {};

  readonly selectedValues = computed(() => this._multiValues());

  readonly filteredOptions = computed<ComboboxOption[]>(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.options;
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  });

  readonly filteredGroups = computed<{ name: string; options: ComboboxOption[] }[]>(() => {
    const opts = this.filteredOptions();
    const groups: Record<string, ComboboxOption[]> = {};

    for (const opt of opts) {
      const g = opt.group ?? '';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    }

    return Object.entries(groups).map(([name, options]) => ({ name, options }));
  });

  readonly hasValue = computed(() =>
    this.mode === 'multi'
      ? this._multiValues().length > 0
      : this._singleValue() !== null
  );

  readonly inputPlaceholder = computed(() => {
    if (this.mode === 'single' && this._singleValue() !== null) {
      return this.getLabel(this._singleValue()!) || this.placeholder;
    }
    if (this.mode === 'multi' && this._multiValues().length > 0) return '';
    return this.placeholder;
  });

  ngOnChanges(_: SimpleChanges): void {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  constructor(private el: ElementRef) {}

  writeValue(val: string | number | Array<string | number> | null): void {
    if (this.mode === 'multi') {
      this._multiValues.set(Array.isArray(val) ? val : val != null ? [val] : []);
    } else {
      this._singleValue.set(Array.isArray(val) ? (val[0] ?? null) : val);
    }
    this.query.set('');
  }
  registerOnChange(fn: (v: string | number | Array<string | number> | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }

  onControlClick(): void {
    if (this.disabled) return;
    this.open();
    setTimeout(() => this.inputEl?.nativeElement.focus(), 0);
  }

  onQueryChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
    this.queryChange.emit(val);
    this.focusedIndex.set(-1);
    if (!this.isOpen()) this.open();
  }

  onKeyDown(event: KeyboardEvent): void {
    const flat = this.filteredOptions().filter(o => !o.disabled);
    if (!flat.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) this.open();
      this.focusedIndex.update(i => Math.min(i + 1, flat.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.update(i => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const idx = this.focusedIndex();
      if (idx >= 0 && flat[idx]) this.selectOption(flat[idx]);
    } else if (event.key === 'Backspace' && !this.query() && this.mode === 'multi') {
      const vals = this._multiValues();
      if (vals.length) this.removeValue(vals[vals.length - 1]);
    }
  }

  selectOption(opt: ComboboxOption, event?: Event): void {
    event?.stopPropagation();
    if (opt.disabled) return;

    if (this.mode === 'multi') {
      const vals = this._multiValues();
      if (vals.includes(opt.value)) {
        this._multiValues.set(vals.filter(v => v !== opt.value));
      } else {
        this._multiValues.set([...vals, opt.value]);
      }
      const newVals = this._multiValues();
      this._onChange(newVals);
      this.valueChange.emit(newVals);
      this.query.set('');
      this.inputEl?.nativeElement.focus();
    } else {
      this._singleValue.set(opt.value);
      this._onChange(opt.value);
      this.valueChange.emit(opt.value);
      this.query.set('');
      this.close();
    }
  }

  removeValue(val: string | number, event?: Event): void {
    event?.stopPropagation();
    const vals = this._multiValues().filter(v => v !== val);
    this._multiValues.set(vals);
    this._onChange(vals);
    this.valueChange.emit(vals);
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (this.mode === 'multi') {
      this._multiValues.set([]);
      this._onChange([]);
      this.valueChange.emit([]);
    } else {
      this._singleValue.set(null);
      this._onChange(null);
      this.valueChange.emit(null);
    }
    this.query.set('');
  }

  open():  void { this.isOpen.set(true);  this._onTouched(); this.opened.emit(); }
  close(): void { this.isOpen.set(false); this.query.set(''); this.closed.emit(); }

  isSelected(val: string | number): boolean {
    if (this.mode === 'multi') return this._multiValues().includes(val);
    return this._singleValue() === val;
  }

  getLabel(val: string | number): string {
    return this.options.find(o => o.value === val)?.label ?? String(val);
  }

  getOptionIndex(opt: ComboboxOption): number {
    return this.filteredOptions().filter(o => !o.disabled).indexOf(opt);
  }
}
