export * from './lib/tokens/design-tokens.interface';
export * from './lib/theme-engine/chameleon-theme.service';
export * from './lib/theme-engine/chameleon-theme.provider';
export * from './lib/utils/class-merge.util';
export * from './lib/utils/token-resolver.util';

export * from './lib/style-props/index';

// Button
export { ChButtonComponent }        from './lib/components/button/helm/button.component';
export { ButtonBrainDirective }     from './lib/components/button/brain/button-brain.directive';
export * from './lib/components/button/button.variants';

// Input
export { ChInputComponent }         from './lib/components/input/helm/input.component';
export { InputBrainDirective }      from './lib/components/input/brain/input-brain.directive';
export * from './lib/components/input/input.variants';

// Card
export {
  ChCardComponent,
  ChCardHeaderComponent,
  ChCardBodyComponent,
  ChCardFooterComponent,
} from './lib/components/card/card.component';

// Badge
export { ChBadgeComponent }         from './lib/components/badge/badge.component';

// Alert
export { ChAlertComponent }         from './lib/components/alert/helm/alert.component';
export type { AlertStatus, AlertVariant } from './lib/components/alert/helm/alert.component';

// Spinner
export { ChSpinnerComponent }       from './lib/components/spinner/spinner.component';

// Avatar
export { ChAvatarComponent, ChAvatarGroupComponent } from './lib/components/avatar/avatar.component';

// Divider
export { ChDividerComponent }       from './lib/components/divider/divider.component';

// Tag
export { ChTagComponent }           from './lib/components/tag/tag.component';

// Skeleton
export { ChSkeletonComponent, ChSkeletonTextComponent } from './lib/components/skeleton/skeleton.component';

// Checkbox
export { ChCheckboxComponent }      from './lib/components/checkbox/checkbox.component';

// Radio
export { ChRadioComponent, ChRadioGroupComponent } from './lib/components/radio/radio.component';

// Switch
export { ChSwitchComponent }        from './lib/components/switch/switch.component';

// Select
export { ChSelectComponent }        from './lib/components/select/select.component';
export type { SelectOption }        from './lib/components/select/select.component';

// Textarea
export { ChTextareaComponent }      from './lib/components/textarea/textarea.component';
export type { TextareaVariant, TextareaResize } from './lib/components/textarea/textarea.component';

// Tooltip
export { ChTooltipDirective }       from './lib/components/tooltip/tooltip.directive';
export type { TooltipPlacement }    from './lib/components/tooltip/tooltip.directive';

// Modal
export { ChModalComponent }         from './lib/components/modal/modal.component';
export type { ModalSize }           from './lib/components/modal/modal.component';

// Drawer
export { ChDrawerComponent }        from './lib/components/drawer/drawer.component';
export type { DrawerPlacement, DrawerSize } from './lib/components/drawer/drawer.component';

// Popover
export { ChPopoverComponent, ChPopoverTriggerDirective } from './lib/components/popover/popover.component';
export type { PopoverPlacement }    from './lib/components/popover/popover.component';

// Dropdown
export {
  ChDropdownMenuComponent,
  ChDropdownItemComponent,
  ChDropdownDividerComponent,
  ChDropdownTriggerDirective,
} from './lib/components/dropdown/dropdown.component';

// Tabs
export { ChTabsComponent, ChTabPanelComponent } from './lib/components/tabs/tabs.component';
export type { TabsVariant }         from './lib/components/tabs/tabs.component';

// Accordion
export { ChAccordionComponent, ChAccordionItemComponent } from './lib/components/accordion/accordion.component';

// Progress
export { ChProgressComponent }      from './lib/components/progress/progress.component';
export type { ProgressVariant }     from './lib/components/progress/progress.component';

// Toast
export { ChToastComponent, ChToastContainerComponent } from './lib/components/toast/toast.component';
export { ChToastService }           from './lib/components/toast/toast.service';
export type { Toast, ToastOptions, ToastStatus, ToastPosition } from './lib/components/toast/toast.service';

// Breadcrumb
export { ChBreadcrumbComponent }    from './lib/components/breadcrumb/breadcrumb.component';
export type { BreadcrumbItem }      from './lib/components/breadcrumb/breadcrumb.component';

// Pagination
export { ChPaginationComponent }    from './lib/components/pagination/pagination.component';

// Table
export { ChTableComponent }         from './lib/components/table/table.component';
export type { TableColumn, TableSortEvent, TableSize } from './lib/components/table/table.component';

// Slider
export { ChSliderComponent }        from './lib/components/slider/slider.component';
export type { SliderSize }          from './lib/components/slider/slider.component';

// Date Picker
export { ChDatePickerComponent }    from './lib/components/date-picker/date-picker.component';
export type { DatePickerMode, DateRange } from './lib/components/date-picker/date-picker.component';

// Menu
export {
  ChMenuComponent,
  ChMenuItemDirective,
  ChMenuDividerComponent,
  ChMenuGroupComponent,
} from './lib/components/menu/menu.component';
export type { MenuItem, MenuTrigger, MenuPlacement } from './lib/components/menu/menu.component';

// Combobox
export { ChComboboxComponent }      from './lib/components/combobox/combobox.component';
export type { ComboboxOption, ComboboxMode } from './lib/components/combobox/combobox.component';

// Chart
export { ChChartComponent }         from './lib/components/chart/chart.component';
export type { ChartType, ChartData, ChartDataset, ChartOptions } from './lib/components/chart/chart.component';

import { ChButtonComponent }       from './lib/components/button/helm/button.component';
import { ChInputComponent }        from './lib/components/input/helm/input.component';
import { ChCardComponent, ChCardHeaderComponent, ChCardBodyComponent, ChCardFooterComponent } from './lib/components/card/card.component';
import { ChBadgeComponent }        from './lib/components/badge/badge.component';
import { ChAlertComponent }        from './lib/components/alert/helm/alert.component';
import { ChSpinnerComponent }      from './lib/components/spinner/spinner.component';
import { ChAvatarComponent, ChAvatarGroupComponent } from './lib/components/avatar/avatar.component';
import { ChDividerComponent }      from './lib/components/divider/divider.component';
import { ChTagComponent }          from './lib/components/tag/tag.component';
import { ChSkeletonComponent, ChSkeletonTextComponent } from './lib/components/skeleton/skeleton.component';
import { ChCheckboxComponent }     from './lib/components/checkbox/checkbox.component';
import { ChRadioComponent, ChRadioGroupComponent } from './lib/components/radio/radio.component';
import { ChSwitchComponent }       from './lib/components/switch/switch.component';
import { ChSelectComponent }       from './lib/components/select/select.component';
import { ChTextareaComponent }     from './lib/components/textarea/textarea.component';
import { ChTooltipDirective }      from './lib/components/tooltip/tooltip.directive';
import { ChModalComponent }        from './lib/components/modal/modal.component';
import { ChDrawerComponent }       from './lib/components/drawer/drawer.component';
import { ChPopoverComponent, ChPopoverTriggerDirective } from './lib/components/popover/popover.component';
import {
  ChDropdownMenuComponent,
  ChDropdownItemComponent,
  ChDropdownDividerComponent,
  ChDropdownTriggerDirective,
} from './lib/components/dropdown/dropdown.component';
import { ChTabsComponent, ChTabPanelComponent } from './lib/components/tabs/tabs.component';
import { ChAccordionComponent, ChAccordionItemComponent } from './lib/components/accordion/accordion.component';
import { ChProgressComponent }     from './lib/components/progress/progress.component';
import { ChToastComponent, ChToastContainerComponent } from './lib/components/toast/toast.component';
import { ChBreadcrumbComponent }   from './lib/components/breadcrumb/breadcrumb.component';
import { ChPaginationComponent }   from './lib/components/pagination/pagination.component';
import { ChTableComponent }        from './lib/components/table/table.component';
import { ChSliderComponent }       from './lib/components/slider/slider.component';
import { ChDatePickerComponent }   from './lib/components/date-picker/date-picker.component';
import {
  ChMenuComponent,
  ChMenuItemDirective,
  ChMenuDividerComponent,
  ChMenuGroupComponent,
}                                  from './lib/components/menu/menu.component';
import { ChComboboxComponent }     from './lib/components/combobox/combobox.component';
import { ChChartComponent }        from './lib/components/chart/chart.component';
import { CHAMELEON_STYLE_PROPS }   from './lib/style-props/index';

export const CHAMELEON_COMPONENTS = [
  ChButtonComponent,
  ChInputComponent,
  ChCardComponent,
  ChCardHeaderComponent,
  ChCardBodyComponent,
  ChCardFooterComponent,
  ChBadgeComponent,
  ChAlertComponent,
  ChSpinnerComponent,
  ChAvatarComponent,
  ChAvatarGroupComponent,
  ChDividerComponent,
  ChTagComponent,
  ChSkeletonComponent,
  ChSkeletonTextComponent,
  ChCheckboxComponent,
  ChRadioComponent,
  ChRadioGroupComponent,
  ChSwitchComponent,
  ChSelectComponent,
  ChTextareaComponent,
  ChTooltipDirective,
  ChModalComponent,
  ChDrawerComponent,
  ChPopoverComponent,
  ChPopoverTriggerDirective,
  ChDropdownMenuComponent,
  ChDropdownItemComponent,
  ChDropdownDividerComponent,
  ChDropdownTriggerDirective,
  ChTabsComponent,
  ChTabPanelComponent,
  ChAccordionComponent,
  ChAccordionItemComponent,
  ChProgressComponent,
  ChToastComponent,
  ChToastContainerComponent,
  ChBreadcrumbComponent,
  ChPaginationComponent,
  ChTableComponent,
  ChSliderComponent,
  ChDatePickerComponent,
  ChMenuComponent,
  ChMenuItemDirective,
  ChMenuDividerComponent,
  ChMenuGroupComponent,
  ChComboboxComponent,
  ChChartComponent,
  ...CHAMELEON_STYLE_PROPS,
] as const;
