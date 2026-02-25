import {
  Component, Input, Output, EventEmitter, signal, computed,
  ChangeDetectionStrategy, ViewEncapsulation, ElementRef, ViewChild,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChUploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  percent?: number;
  url?: string;
  thumbUrl?: string;
  originFile?: File;
}

@Component({
  selector: 'ch-upload',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChUploadComponent), multi: true }],
  template: `
    <div class="ch-upload" [class.ch-upload--drag]="drag" [class.ch-upload--dragging]="isDragging()">
      @if (drag) {
        <div class="ch-upload__dragger"
             (click)="triggerInput()"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <div class="ch-upload__drag-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ch-upload__drag-text">Click or drag file to this area to upload</div>
          <div class="ch-upload__drag-hint" *ngIf="hint">{{ hint }}</div>
        </div>
      } @else if (listType === 'picture-card') {
        <div class="ch-upload__picture-card-list">
          @for (file of fileList(); track file.uid) {
            <div class="ch-upload__picture-card-item" [attr.data-status]="file.status">
              @if (file.status === 'uploading') {
                <div class="ch-upload__picture-card-uploading">
                  <div class="ch-upload__progress-circle"></div>
                </div>
              } @else {
                <img [src]="file.thumbUrl || file.url" [alt]="file.name" />
                <div class="ch-upload__picture-card-actions">
                  <button (click)="removeFile(file)" class="ch-upload__action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              }
            </div>
          }
          <div class="ch-upload__picture-card-btn" (click)="triggerInput()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Upload</span>
          </div>
        </div>
      } @else {
        <button class="ch-upload__btn" (click)="triggerInput()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>{{ buttonText }}</span>
        </button>
      }

      <input #fileInput type="file" class="ch-upload__input"
             [accept]="accept" [multiple]="multiple"
             (change)="onFileChange($event)" />

      @if (showList && listType !== 'picture-card') {
        <ul class="ch-upload__list">
          @for (file of fileList(); track file.uid) {
            <li class="ch-upload__list-item" [attr.data-status]="file.status">
              <svg class="ch-upload__list-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span class="ch-upload__list-name">{{ file.name }}</span>
              @if (file.status === 'uploading') {
                <div class="ch-upload__list-progress">
                  <div class="ch-upload__list-progress-bar" [style.width.%]="file.percent || 0"></div>
                </div>
              }
              @if (file.status === 'done') {
                <svg class="ch-upload__list-status ch-upload__list-status--done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              }
              @if (file.status === 'error') {
                <svg class="ch-upload__list-status ch-upload__list-status--error" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
              <button class="ch-upload__list-remove" (click)="removeFile(file)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .ch-upload__input { display: none; }
    .ch-upload__btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 16px; border: 1px solid var(--ch-border);
      border-radius: var(--ch-btn-radius, var(--ch-radius-md));
      background: var(--ch-bg); color: var(--ch-text);
      font-size: var(--ch-text-sm); cursor: pointer;
      transition: all var(--ch-transition-fast, 150ms ease);
    }
    .ch-upload__btn:hover { border-color: var(--ch-primary); color: var(--ch-primary); }

    .ch-upload__dragger {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 32px 24px; border: 2px dashed var(--ch-border);
      border-radius: var(--ch-radius-lg, 8px); cursor: pointer;
      transition: all var(--ch-transition-fast, 150ms ease);
      text-align: center;
    }
    .ch-upload--dragging .ch-upload__dragger,
    .ch-upload__dragger:hover { border-color: var(--ch-primary); background: var(--ch-primary-subtle); }
    .ch-upload__drag-icon { color: var(--ch-primary); margin-bottom: 8px; }
    .ch-upload__drag-text { font-size: var(--ch-text-md); color: var(--ch-text); font-weight: var(--ch-weight-medium); }
    .ch-upload__drag-hint { font-size: var(--ch-text-sm); color: var(--ch-text-muted); margin-top: 4px; }

    .ch-upload__list { list-style: none; margin: 8px 0 0; padding: 0; }
    .ch-upload__list-item {
      display: flex; align-items: center; gap: 8px; padding: 6px 8px;
      border-radius: var(--ch-radius-sm); transition: background 0.15s;
    }
    .ch-upload__list-item:hover { background: var(--ch-bg-subtle); }
    .ch-upload__list-icon { flex-shrink: 0; color: var(--ch-text-muted); }
    .ch-upload__list-name { flex: 1; font-size: var(--ch-text-sm); color: var(--ch-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ch-upload__list-item[data-status="error"] .ch-upload__list-name { color: var(--ch-error); }
    .ch-upload__list-status--done { color: var(--ch-success); }
    .ch-upload__list-status--error { color: var(--ch-error); }
    .ch-upload__list-progress { flex: 0 0 120px; height: 4px; background: var(--ch-bg-subtle); border-radius: 2px; overflow: hidden; }
    .ch-upload__list-progress-bar { height: 100%; background: var(--ch-primary); border-radius: 2px; transition: width 0.3s; }
    .ch-upload__list-remove {
      flex-shrink: 0; background: none; border: none; padding: 2px;
      color: var(--ch-text-muted); cursor: pointer; display: flex; opacity: 0;
      transition: opacity 0.15s;
    }
    .ch-upload__list-item:hover .ch-upload__list-remove { opacity: 1; }
    .ch-upload__list-remove:hover { color: var(--ch-error); }

    .ch-upload__picture-card-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .ch-upload__picture-card-item {
      position: relative; width: 104px; height: 104px;
      border: 1px solid var(--ch-border); border-radius: var(--ch-radius-md);
      overflow: hidden;
    }
    .ch-upload__picture-card-item img { width: 100%; height: 100%; object-fit: cover; }
    .ch-upload__picture-card-actions {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s;
    }
    .ch-upload__picture-card-item:hover .ch-upload__picture-card-actions { opacity: 1; }
    .ch-upload__action-btn {
      background: none; border: none; color: #fff; cursor: pointer; padding: 4px;
    }
    .ch-upload__picture-card-btn {
      width: 104px; height: 104px; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 4px;
      border: 1px dashed var(--ch-border); border-radius: var(--ch-radius-md);
      color: var(--ch-text-muted); cursor: pointer; font-size: var(--ch-text-sm);
      transition: all 0.15s;
    }
    .ch-upload__picture-card-btn:hover { border-color: var(--ch-primary); color: var(--ch-primary); }
    .ch-upload__picture-card-uploading { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    .ch-upload__progress-circle {
      width: 24px; height: 24px; border: 2px solid var(--ch-border);
      border-top-color: var(--ch-primary); border-radius: 50%;
      animation: ch-upload-spin 0.8s linear infinite;
    }
    @keyframes ch-upload-spin { to { transform: rotate(360deg); } }
  `]
})
export class ChUploadComponent implements ControlValueAccessor {
  @Input() accept = '';
  @Input() multiple = false;
  @Input() drag = false;
  @Input() listType: 'text' | 'picture-card' = 'text';
  @Input() showList = true;
  @Input() buttonText = 'Click to Upload';
  @Input() hint = '';
  @Input() maxCount = 0;
  @Input() maxSize = 0; // bytes
  @Input() disabled = false;
  @Output() filesChange = new EventEmitter<ChUploadFile[]>();
  @Output() fileRemove = new EventEmitter<ChUploadFile>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  fileList = signal<ChUploadFile[]>([]);
  isDragging = signal(false);
  private uid = 0;
  private onChange: (v: ChUploadFile[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: ChUploadFile[]) { if (v) this.fileList.set(v); }
  registerOnChange(fn: (v: ChUploadFile[]) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }

  triggerInput() { if (!this.disabled) this.fileInputRef.nativeElement.click(); }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation(); this.isDragging.set(true); }
  onDragLeave(e: DragEvent) { e.preventDefault(); e.stopPropagation(); this.isDragging.set(false); }
  onDrop(e: DragEvent) {
    e.preventDefault(); e.stopPropagation(); this.isDragging.set(false);
    if (e.dataTransfer?.files) this.addFiles(Array.from(e.dataTransfer.files));
  }

  private addFiles(files: File[]) {
    const newFiles: ChUploadFile[] = files
      .filter(f => !this.maxSize || f.size <= this.maxSize)
      .map(f => ({
        uid: `ch-upload-${++this.uid}`, name: f.name, size: f.size,
        type: f.type, status: 'done' as const, percent: 100, originFile: f,
        thumbUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      }));
    let list = [...this.fileList(), ...newFiles];
    if (this.maxCount > 0) list = list.slice(-this.maxCount);
    this.fileList.set(list);
    this.onChange(list);
    this.filesChange.emit(list);
    this.onTouched();
  }

  removeFile(file: ChUploadFile) {
    this.fileList.update(list => list.filter(f => f.uid !== file.uid));
    this.fileRemove.emit(file);
    this.onChange(this.fileList());
    this.filesChange.emit(this.fileList());
  }
}
