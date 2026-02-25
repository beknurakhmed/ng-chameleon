import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  icon?: string;
  disabled?: boolean;
  isLeaf?: boolean;
}

@Component({
  selector: 'ch-tree',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ch-tree" [class.ch-tree--show-line]="showLine()">
      @for (node of data(); track node.key) {
        <ng-container
          *ngTemplateOutlet="nodeTemplate; context: { $implicit: node, level: 0 }"
        ></ng-container>
      }
    </div>

    <ng-template #nodeTemplate let-node let-level="level">
      <div class="ch-tree__node" [class.ch-tree__node--disabled]="node.disabled">
        <div
          class="ch-tree__node-content"
          [class.ch-tree__node-content--selected]="selectable() && selectedKey() === node.key"
          [style.padding-left.px]="level * 24"
          (click)="onNodeClick(node)"
        >
          <!-- Expand / collapse toggle -->
          <button
            class="ch-tree__toggle"
            [class.ch-tree__toggle--expanded]="isExpanded(node.key)"
            [class.ch-tree__toggle--hidden]="node.isLeaf || !node.children?.length"
            (click)="toggleExpand(node, $event)"
            type="button"
            aria-label="Toggle expand"
          >
            <svg
              class="ch-tree__toggle-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M6 3l5 5-5 5V3z" />
            </svg>
          </button>

          <!-- Checkbox (when checkable) -->
          @if (checkable()) {
            <label class="ch-tree__checkbox-wrapper" (click)="$event.stopPropagation()">
              <input
                type="checkbox"
                class="ch-tree__checkbox"
                [checked]="isChecked(node.key)"
                [disabled]="node.disabled"
                (change)="toggleCheck(node)"
              />
              <span class="ch-tree__checkbox-indicator"></span>
            </label>
          }

          <!-- Icon (optional) -->
          @if (node.icon) {
            <span class="ch-tree__icon">{{ node.icon }}</span>
          }

          <!-- Label -->
          <span class="ch-tree__label">{{ node.label }}</span>
        </div>

        <!-- Children -->
        @if (node.children?.length && !node.isLeaf) {
          <div
            class="ch-tree__node-children"
            [class.ch-tree__node-children--expanded]="isExpanded(node.key)"
            [style.padding-left.px]="showLine() ? 12 : 0"
          >
            @for (child of node.children; track child.key) {
              <ng-container
                *ngTemplateOutlet="nodeTemplate; context: { $implicit: child, level: level + 1 }"
              ></ng-container>
            }
          </div>
        }
      </div>
    </ng-template>
  `,
  styles: [`
    .ch-tree {
      font-family: var(--ch-font-family, inherit);
      font-size: var(--ch-font-size-sm, 14px);
      color: var(--ch-text, #1a1a1a);
      user-select: none;
    }

    /* ------------------------------------------------
       Node content row
    ------------------------------------------------ */
    .ch-tree__node-content {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: var(--ch-radius-sm, 4px);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .ch-tree__node-content:hover {
      background-color: var(--ch-bg-subtle, #f5f5f5);
    }

    .ch-tree__node-content--selected {
      background-color: var(--ch-primary-subtle, #e8f0fe);
      color: var(--ch-primary, #1a73e8);
    }

    .ch-tree__node-content--selected:hover {
      background-color: var(--ch-primary-subtle, #e8f0fe);
    }

    .ch-tree__node--disabled > .ch-tree__node-content {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ------------------------------------------------
       Expand / collapse toggle
    ------------------------------------------------ */
    .ch-tree__toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      min-width: 20px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--ch-text-muted, #6b6b6b);
      cursor: pointer;
      border-radius: var(--ch-radius-sm, 4px);
      transition: background-color 0.15s ease;
    }

    .ch-tree__toggle:hover {
      background-color: var(--ch-bg-subtle, #f5f5f5);
    }

    .ch-tree__toggle--hidden {
      visibility: hidden;
      pointer-events: none;
    }

    .ch-tree__toggle-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .ch-tree__toggle--expanded .ch-tree__toggle-icon {
      transform: rotate(90deg);
    }

    /* ------------------------------------------------
       Checkbox
    ------------------------------------------------ */
    .ch-tree__checkbox-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      min-width: 16px;
      cursor: pointer;
    }

    .ch-tree__checkbox {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .ch-tree__checkbox-indicator {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid var(--ch-border, #d0d0d0);
      border-radius: var(--ch-radius-sm, 3px);
      background: var(--ch-bg, #fff);
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .ch-tree__checkbox:checked + .ch-tree__checkbox-indicator {
      background-color: var(--ch-primary, #1a73e8);
      border-color: var(--ch-primary, #1a73e8);
      background-image: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27white%27%3E%3Cpath d=%27M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z%27/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 14px 14px;
    }

    .ch-tree__checkbox:disabled + .ch-tree__checkbox-indicator {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ------------------------------------------------
       Icon & label
    ------------------------------------------------ */
    .ch-tree__icon {
      display: inline-flex;
      align-items: center;
      font-size: 16px;
      line-height: 1;
      color: var(--ch-text-muted, #6b6b6b);
    }

    .ch-tree__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.5;
    }

    /* ------------------------------------------------
       Children (smooth height transition)
    ------------------------------------------------ */
    .ch-tree__node-children {
      display: grid;
      grid-template-rows: 0fr;
      overflow: hidden;
      transition: grid-template-rows 0.25s ease;
    }

    .ch-tree__node-children > * {
      min-height: 0;
    }

    .ch-tree__node-children--expanded {
      grid-template-rows: 1fr;
    }

    /* ------------------------------------------------
       Show-line mode
    ------------------------------------------------ */
    .ch-tree--show-line .ch-tree__node-children {
      border-left: 1px solid var(--ch-border, #d0d0d0);
      margin-left: 18px;
    }
  `],
})
export class TreeComponent {
  /** The tree data source. */
  readonly data = input<TreeNode[]>([]);

  /** Whether checkboxes are displayed beside each node. */
  readonly checkable = input<boolean>(false);

  /** Whether nodes are selectable on click. */
  readonly selectable = input<boolean>(true);

  /** Whether all nodes should be expanded by default. */
  readonly defaultExpandAll = input<boolean>(false);

  /** Whether to show connecting lines between parent and child nodes. */
  readonly showLine = input<boolean>(false);

  /** Emits when a node row is clicked. */
  readonly nodeClick = output<TreeNode>();

  /** Emits when a node is expanded or collapsed. */
  readonly nodeExpand = output<TreeNode>();

  /** Emits when a node checkbox is toggled. */
  readonly nodeCheck = output<{ node: TreeNode; checked: boolean }>();

  /** Internal expanded-state map (key -> expanded). */
  private readonly expandedMap = signal<Map<string, boolean>>(new Map());

  /** Internal checked-state map (key -> checked). */
  private readonly checkedMap = signal<Map<string, boolean>>(new Map());

  /** The currently selected node key. */
  readonly selectedKey = signal<string | null>(null);

  /** Tracks whether initial default-expand has been applied. */
  private defaultExpandApplied = false;

  /** Lazily expand all nodes if defaultExpandAll is set. */
  private ensureDefaultExpand(): void {
    if (this.defaultExpandAll() && !this.defaultExpandApplied) {
      this.defaultExpandApplied = true;
      const map = new Map<string, boolean>();
      const walk = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          if (node.children?.length && !node.isLeaf) {
            map.set(node.key, true);
          }
          if (node.children) {
            walk(node.children);
          }
        }
      };
      walk(this.data());
      this.expandedMap.set(map);
    }
  }

  /** Returns whether the given node key is currently expanded. */
  isExpanded(key: string): boolean {
    this.ensureDefaultExpand();
    return this.expandedMap().get(key) ?? false;
  }

  /** Returns whether the given node key is currently checked. */
  isChecked(key: string): boolean {
    return this.checkedMap().get(key) ?? false;
  }

  /** Toggles the expand state for a node. */
  toggleExpand(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (node.disabled) return;

    const map = new Map(this.expandedMap());
    const current = map.get(node.key) ?? false;
    map.set(node.key, !current);
    this.expandedMap.set(map);
    this.nodeExpand.emit(node);
  }

  /** Toggles the checked state for a node. */
  toggleCheck(node: TreeNode): void {
    if (node.disabled) return;

    const map = new Map(this.checkedMap());
    const current = map.get(node.key) ?? false;
    const next = !current;
    map.set(node.key, next);
    this.checkedMap.set(map);
    this.nodeCheck.emit({ node, checked: next });
  }

  /** Handles a node row click: selects the node and emits. */
  onNodeClick(node: TreeNode): void {
    if (node.disabled) return;

    if (this.selectable()) {
      this.selectedKey.set(node.key);
    }

    this.nodeClick.emit(node);
  }
}
