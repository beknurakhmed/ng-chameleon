import {
  Component, Input, ChangeDetectionStrategy, signal, computed,
  ViewEncapsulation, OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area';

export interface ChartDataset {
  label:   string;
  data:    number[];
  color?:  string;
}

export interface ChartData {
  labels:   string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  width?:        number;
  height?:       number;
  padding?:      number;
  showGrid?:     boolean;
  showLegend?:   boolean;
  showTooltips?: boolean;
  showLabels?:   boolean;
  animate?:      boolean;
  donutHole?:    number;   // 0-1 for donut (inner radius ratio)
  yMin?:         number;
  yMax?:         number;
  formatY?:      (v: number) => string;
  formatX?:      (v: string) => string;
}

interface Point { x: number; y: number; }
interface Bar    { x: number; y: number; w: number; h: number; value: number; label: string; }
interface Slice  { path: string; midX: number; midY: number; value: number; pct: number; label: string; color: string; }

// Default color palette derived from CSS vars (falls back to fixed hsl values)
const PALETTE = [
  'var(--ch-primary,   hsl(243 75% 59%))',
  'var(--ch-success,   hsl(142 72% 45%))',
  'var(--ch-warning,   hsl(38 92% 50%))',
  'var(--ch-error,     hsl(0 72% 51%))',
  'var(--ch-info,      hsl(199 89% 48%))',
  'var(--ch-secondary, hsl(262 52% 47%))',
  'hsl(24 95% 53%)',
  'hsl(168 76% 42%)',
];

function color(idx: number, override?: string): string {
  return override ?? PALETTE[idx % PALETTE.length];
}

function pathFromPoints(pts: Point[], close = false): string {
  if (!pts.length) return '';
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  return close ? d + ' Z' : d;
}

function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return pathFromPoints(pts);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpX1 = prev.x + (curr.x - prev.x) / 3;
    const cpX2 = curr.x - (curr.x - prev.x) / 3;
    d += ` C ${cpX1} ${prev.y} ${cpX2} ${curr.y} ${curr.x} ${curr.y}`;
  }
  return d;
}

@Component({
  selector: 'ch-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <figure class="ch-chart" [style.width.px]="opts.width">
      <!-- Title -->
      @if (title) {
        <figcaption class="ch-chart__title">{{ title }}</figcaption>
      }

      <!-- Legend -->
      @if (opts.showLegend && type !== 'pie' && type !== 'donut') {
        <div class="ch-chart__legend">
          @for (ds of data.datasets; track ds.label; let i = $index) {
            <span class="ch-chart__legend-item">
              <span class="ch-chart__legend-dot" [style.background]="color(i, ds.color)"></span>
              {{ ds.label }}
            </span>
          }
        </div>
      }

      <div class="ch-chart__svg-wrap" (mousemove)="onMouseMove($event)" (mouseleave)="tooltip.set(null)">
        <svg
          [attr.width]="opts.width"
          [attr.height]="opts.height"
          [attr.viewBox]="'0 0 ' + opts.width + ' ' + opts.height"
          class="ch-chart__svg"
          role="img"
          [attr.aria-label]="title || 'Chart'"
        >
          <!-- Grid lines (line/bar/area) -->
          @if ((type === 'line' || type === 'bar' || type === 'area') && opts.showGrid) {
            @for (tick of yTicks(); track tick.value) {
              <line
                [attr.x1]="plotLeft"
                [attr.y1]="tick.y"
                [attr.x2]="plotRight()"
                [attr.y2]="tick.y"
                class="ch-chart__grid-line"
              />
              <text
                [attr.x]="plotLeft - 6"
                [attr.y]="tick.y + 4"
                class="ch-chart__axis-label"
                text-anchor="end"
              >{{ opts.formatY ? opts.formatY(tick.value) : tick.value }}</text>
            }

            <!-- X axis labels -->
            @for (lbl of xLabels(); track lbl.label; let i = $index) {
              <text
                [attr.x]="lbl.x"
                [attr.y]="plotBottom + 16"
                class="ch-chart__axis-label"
                text-anchor="middle"
              >{{ opts.formatX ? opts.formatX(lbl.label) : lbl.label }}</text>
            }

            <!-- Axes -->
            <line
              [attr.x1]="plotLeft" [attr.y1]="plotTop"
              [attr.x2]="plotLeft" [attr.y2]="plotBottom"
              class="ch-chart__axis"
            />
            <line
              [attr.x1]="plotLeft" [attr.y1]="plotBottom"
              [attr.x2]="plotRight()" [attr.y2]="plotBottom"
              class="ch-chart__axis"
            />
          }

          <!-- line -->
          @if (type === 'line') {
            @for (series of lineSeries(); track series.label; let i = $index) {
              <path
                [attr.d]="series.path"
                fill="none"
                [attr.stroke]="color(i, series.color)"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                class="ch-chart__line"
              />
              @for (pt of series.points; track $index) {
                <circle
                  [attr.cx]="pt.x"
                  [attr.cy]="pt.y"
                  r="4"
                  [attr.fill]="color(i, series.color)"
                  class="ch-chart__dot"
                  (mouseenter)="setTooltip(pt, series.label, data.labels[$index])"
                />
              }
            }
          }

          <!-- area -->
          @if (type === 'area') {
            @for (series of areaSeries(); track series.label; let i = $index) {
              <defs>
                <linearGradient [attr.id]="'area-grad-' + i" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" [attr.stop-color]="color(i, series.color)" stop-opacity="0.25"/>
                  <stop offset="100%" [attr.stop-color]="color(i, series.color)" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <path
                [attr.d]="series.areaPath"
                [attr.fill]="'url(#area-grad-' + i + ')'"
              />
              <path
                [attr.d]="series.linePath"
                fill="none"
                [attr.stroke]="color(i, series.color)"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            }
          }

          <!-- bar -->
          @if (type === 'bar') {
            @for (group of barGroups(); track $index; let gi = $index) {
              @for (bar of group; track $index; let bi = $index) {
                <rect
                  [attr.x]="bar.x"
                  [attr.y]="bar.y"
                  [attr.width]="bar.w"
                  [attr.height]="bar.h"
                  [attr.fill]="color(bi, data.datasets[bi]?.color)"
                  rx="2"
                  class="ch-chart__bar"
                  (mouseenter)="setTooltipBar(bar)"
                  (mouseleave)="tooltip.set(null)"
                />
              }
            }
          }

          <!-- pie/donut -->
          @if (type === 'pie' || type === 'donut') {
            @for (slice of pieSlices(); track slice.label) {
              <path
                [attr.d]="slice.path"
                [attr.fill]="slice.color"
                class="ch-chart__slice"
                (mouseenter)="setTooltipSlice(slice)"
                (mouseleave)="tooltip.set(null)"
              >
                <title>{{ slice.label }}: {{ slice.value }} ({{ slice.pct }}%)</title>
              </path>
            }
            @if (opts.showLabels) {
              @for (slice of pieSlices(); track slice.label) {
                <text
                  [attr.x]="slice.midX"
                  [attr.y]="slice.midY"
                  class="ch-chart__pie-label"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >{{ slice.pct }}%</text>
              }
            }
            <!-- Donut legend -->
            @if (opts.showLegend) {
              <foreignObject [attr.x]="opts.width! * 0.7" y="20" [attr.width]="opts.width! * 0.28" [attr.height]="opts.height">
                <div class="ch-chart__pie-legend">
                  @for (slice of pieSlices(); track slice.label) {
                    <div class="ch-chart__pie-legend-item">
                      <span class="ch-chart__legend-dot" [style.background]="slice.color"></span>
                      <span>{{ slice.label }}</span>
                      <strong>{{ slice.pct }}%</strong>
                    </div>
                  }
                </div>
              </foreignObject>
            }
          }

          <!-- Tooltip indicator line (line/area) -->
          @if (tooltip() && (type === 'line' || type === 'area')) {
            <line
              [attr.x1]="tooltip()!.x" [attr.y1]="plotTop"
              [attr.x2]="tooltip()!.x" [attr.y2]="plotBottom"
              class="ch-chart__tooltip-line"
            />
          }
        </svg>

        <!-- HTML Tooltip overlay -->
        @if (tooltip()) {
          <div
            class="ch-chart__tooltip"
            [style.left.px]="tooltipX()"
            [style.top.px]="tooltip()!.y - 40"
          >
            <strong>{{ tooltip()!.xLabel }}</strong>
            <span>{{ tooltip()!.label }}: {{ opts.formatY ? opts.formatY(tooltip()!.value) : tooltip()!.value }}</span>
          </div>
        }
      </div>
    </figure>
  `,
  styles: [`
    .ch-chart { margin: 0; display: inline-flex; flex-direction: column; gap: 0.5rem; }
    .ch-chart__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ch-text, #1a202c);
      text-align: center;
    }
    .ch-chart__legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      justify-content: center;
    }
    .ch-chart__legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--ch-text-subtle, #4a5568);
    }
    .ch-chart__legend-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .ch-chart__svg-wrap { position: relative; }
    .ch-chart__svg { overflow: visible; display: block; }

    /* Grid */
    .ch-chart__grid-line {
      stroke: var(--ch-border, #e2e8f0);
      stroke-width: 1;
      stroke-dasharray: 4 4;
    }
    .ch-chart__axis {
      stroke: var(--ch-border-strong, #cbd5e0);
      stroke-width: 1;
    }
    .ch-chart__axis-label {
      font-size: 11px;
      fill: var(--ch-text-muted, #a0aec0);
      font-family: inherit;
    }

    /* Line/Area */
    .ch-chart__line { transition: opacity 0.15s; }
    .ch-chart__dot {
      cursor: pointer;
      transition: r 0.15s;
    }
    .ch-chart__dot:hover { r: 6px; }
    .ch-chart__tooltip-line {
      stroke: var(--ch-border-strong, #cbd5e0);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      pointer-events: none;
    }

    /* Bar */
    .ch-chart__bar {
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .ch-chart__bar:hover { opacity: 0.8; }

    /* Pie/Donut */
    .ch-chart__slice {
      cursor: pointer;
      transition: opacity 0.15s;
      stroke: var(--ch-bg, #fff);
      stroke-width: 2;
    }
    .ch-chart__slice:hover { opacity: 0.85; }
    .ch-chart__pie-label {
      font-size: 11px;
      fill: white;
      font-weight: 600;
      pointer-events: none;
    }
    .ch-chart__pie-legend {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ch-chart__pie-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--ch-text-subtle, #4a5568);
    }
    .ch-chart__pie-legend-item strong {
      margin-left: auto;
      color: var(--ch-text, #1a202c);
    }

    /* Tooltip */
    .ch-chart__tooltip {
      position: absolute;
      background: var(--ch-text, #1a202c);
      color: white;
      border-radius: var(--ch-radius-sm, 4px);
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
      pointer-events: none;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-shadow: var(--ch-shadow-md, 0 4px 12px rgba(0,0,0,0.15));
      transform: translateX(-50%);
      z-index: 10;
    }
  `],
})
export class ChChartComponent implements OnChanges {

  protected color = color;

  @Input() type:    ChartType   = 'line';
  @Input() data:    ChartData   = { labels: [], datasets: [] };
  @Input() options: ChartOptions = {};
  @Input() title?:  string;

  // Merged options with defaults
  protected opts!: Required<ChartOptions>;

  // Plot area dimensions
  protected plotLeft   = 48;
  protected plotTop    = 16;
  protected get plotBottom() { return this.opts.height - 32; }

  readonly tooltip = signal<{
    x: number; y: number; value: number; label: string; xLabel: string
  } | null>(null);

  readonly tooltipX = computed(() => {
    const t = this.tooltip();
    if (!t) return 0;
    const half = this.opts.width / 2;
    return t.x > half ? t.x - 80 : t.x;
  });

  protected plotRight():  number { return this.opts.width - 16; }
  protected plotWidth():  number { return this.plotRight() - this.plotLeft; }
  protected plotHeight(): number { return this.plotBottom - this.plotTop; }


  readonly yRange = computed<{ min: number; max: number }>(() => {
    const allValues = this.data.datasets.flatMap(ds => ds.data);
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const padding = (rawMax - rawMin) * 0.1 || 10;
    return {
      min: this.opts.yMin ?? Math.floor(rawMin - padding),
      max: this.opts.yMax ?? Math.ceil(rawMax + padding),
    };
  });

  readonly yTicks = computed<{ value: number; y: number }[]>(() => {
    const { min, max } = this.yRange();
    const tickCount = 5;
    const step = Math.ceil((max - min) / tickCount);
    const ticks: { value: number; y: number }[] = [];
    for (let v = min; v <= max; v += step) {
      ticks.push({ value: v, y: this.valueToY(v) });
    }
    return ticks;
  });

  readonly xLabels = computed<{ label: string; x: number }[]>(() =>
    this.data.labels.map((label, i) => ({
      label,
      x: this.indexToX(i),
    }))
  );

  readonly lineSeries = computed(() =>
    this.data.datasets.map(ds => {
      const points: Point[] = ds.data.map((v, i) => ({
        x: this.indexToX(i),
        y: this.valueToY(v),
      }));
      return {
        label:  ds.label,
        color:  ds.color,
        points,
        path:   smoothPath(points),
      };
    })
  );

  readonly areaSeries = computed(() =>
    this.data.datasets.map(ds => {
      const points: Point[] = ds.data.map((v, i) => ({
        x: this.indexToX(i),
        y: this.valueToY(v),
      }));
      const linePath  = smoothPath(points);
      const areaClose = `L ${points[points.length - 1].x} ${this.plotBottom} L ${points[0].x} ${this.plotBottom} Z`;
      return {
        label:    ds.label,
        color:    ds.color,
        linePath,
        areaPath: linePath + ' ' + areaClose,
      };
    })
  );

  readonly barGroups = computed<Bar[][]>(() => {
    const n       = this.data.datasets.length;
    const labels  = this.data.labels.length;
    const groupW  = this.plotWidth() / labels;
    const barW    = (groupW * 0.7) / n;
    const gap     = groupW * 0.15;

    return this.data.labels.map((_, gi) =>
      this.data.datasets.map((ds, bi) => {
        const value = ds.data[gi] ?? 0;
        const yVal  = this.valueToY(value);
        return {
          x:     this.plotLeft + gi * groupW + gap + bi * (barW + 2),
          y:     yVal,
          w:     barW,
          h:     this.plotBottom - yVal,
          value,
          label: this.data.labels[gi],
        };
      })
    );
  });

  readonly pieSlices = computed<Slice[]>(() => {
    const dataset = this.data.datasets[0];
    if (!dataset) return [];

    const total  = dataset.data.reduce((s, v) => s + v, 0) || 1;
    const cx     = this.opts.width * 0.35;
    const cy     = this.opts.height / 2;
    const r      = Math.min(cx, cy) - 10;
    const ir     = (this.type === 'donut') ? r * (this.opts.donutHole ?? 0.55) : 0;

    let startAngle = -Math.PI / 2;
    return dataset.data.map((value, i) => {
      const pct    = value / total;
      const angle  = pct * 2 * Math.PI;
      const endA   = startAngle + angle;
      const large  = angle > Math.PI ? 1 : 0;

      const x1 = cx + r  * Math.cos(startAngle);
      const y1 = cy + r  * Math.sin(startAngle);
      const x2 = cx + r  * Math.cos(endA);
      const y2 = cy + r  * Math.sin(endA);

      let path: string;
      if (ir === 0) {
        path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      } else {
        const ix1 = cx + ir * Math.cos(startAngle);
        const iy1 = cy + ir * Math.sin(startAngle);
        const ix2 = cx + ir * Math.cos(endA);
        const iy2 = cy + ir * Math.sin(endA);
        path = `M ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 1 ${ix2} ${iy2} L ${x2} ${y2} A ${r} ${r} 0 ${large} 0 ${x1} ${y1} Z`;
      }

      const midA = startAngle + angle / 2;
      const labelR = (r + ir) / 2 + (ir === 0 ? r * 0.4 : 0);
      const midX   = cx + labelR * Math.cos(midA);
      const midY   = cy + labelR * Math.sin(midA);

      startAngle = endA;
      return {
        path,
        midX, midY,
        value,
        pct:   Math.round(pct * 100),
        label: this.data.labels[i] ?? dataset.label,
        color: color(i),
      };
    });
  });

  ngOnChanges(_: SimpleChanges): void {
    this.opts = {
      width:        this.options.width        ?? 480,
      height:       this.options.height       ?? 280,
      padding:      this.options.padding      ?? 0,
      showGrid:     this.options.showGrid     ?? true,
      showLegend:   this.options.showLegend   ?? true,
      showTooltips: this.options.showTooltips ?? true,
      showLabels:   this.options.showLabels   ?? false,
      animate:      this.options.animate      ?? false,
      donutHole:    this.options.donutHole    ?? 0.55,
      yMin:         this.options.yMin,
      yMax:         this.options.yMax,
      formatY:      this.options.formatY,
      formatX:      this.options.formatX,
    } as Required<ChartOptions>;
  }

  onMouseMove(_: MouseEvent): void {}

  setTooltip(pt: Point, label: string, xLabel: string): void {
    const ds    = this.data.datasets.find(d => d.label === label);
    const idx   = this.data.datasets.indexOf(ds!);
    const ptIdx = this.lineSeries()[idx]?.points.indexOf(pt) ?? 0;
    this.tooltip.set({ x: pt.x, y: pt.y, value: ds?.data[ptIdx] ?? 0, label, xLabel });
  }

  setTooltipBar(bar: Bar): void {
    this.tooltip.set({ x: bar.x + bar.w / 2, y: bar.y, value: bar.value, label: '', xLabel: bar.label });
  }

  setTooltipSlice(slice: Slice): void {
    this.tooltip.set({ x: slice.midX, y: slice.midY, value: slice.value, label: slice.label, xLabel: '' });
  }

  private valueToY(v: number): number {
    const { min, max } = this.yRange();
    const pct = (v - min) / (max - min);
    return this.plotBottom - pct * this.plotHeight();
  }

  private indexToX(i: number): number {
    const n = this.data.labels.length;
    if (n <= 1) return this.plotLeft + this.plotWidth() / 2;
    return this.plotLeft + (i / (n - 1)) * this.plotWidth();
  }
}
