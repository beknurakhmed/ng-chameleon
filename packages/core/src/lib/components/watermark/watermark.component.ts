import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ch-watermark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ch-watermark">
      <ng-content></ng-content>
      <div
        #overlayRef
        class="ch-watermark__overlay"
        [style.z-index]="zIndex"
        [style.background-image]="backgroundImage"
      ></div>
    </div>
  `,
  styles: [
    `
      .ch-watermark {
        position: relative;
        overflow: hidden;
      }

      .ch-watermark__overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-repeat: repeat;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WatermarkComponent implements OnInit, OnChanges {
  @Input() content: string | string[] = '';
  @Input() fontSize: number = 14;
  @Input() color: string = 'rgba(0,0,0,0.08)';
  @Input() rotate: number = -22;
  @Input() gap: [number, number] = [100, 100];
  @Input() offset?: [number, number];
  @Input() zIndex: number = 9;

  backgroundImage: string = '';

  ngOnInit(): void {
    this.renderWatermark();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderWatermark();
  }

  private renderWatermark(): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const lines = Array.isArray(this.content) ? this.content : [this.content];
    const lineHeight = this.fontSize + 4;
    const textBlockHeight = lines.length * lineHeight;

    // Measure the widest line to determine canvas sizing
    ctx.font = `${this.fontSize}px sans-serif`;
    const maxTextWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line).width)
    );

    const [gapX, gapY] = this.gap;

    // Canvas dimensions accommodate the text block plus the gap
    const canvasWidth = maxTextWidth + gapX;
    const canvasHeight = textBlockHeight + gapY;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Re-set font after resizing canvas (resizing resets context state)
    ctx.font = `${this.fontSize}px sans-serif`;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apply rotation from the center of the canvas
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const offsetX = this.offset ? this.offset[0] : 0;
    const offsetY = this.offset ? this.offset[1] : 0;

    ctx.translate(centerX + offsetX, centerY + offsetY);
    ctx.rotate((this.rotate * Math.PI) / 180);

    // Draw each line of text centered around the origin
    const startY = -((lines.length - 1) * lineHeight) / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 0, startY + i * lineHeight);
    }

    const dataUrl = canvas.toDataURL();
    this.backgroundImage = `url("${dataUrl}")`;
  }
}
