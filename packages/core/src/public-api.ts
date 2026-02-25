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

// InputNumber
export { InputNumberComponent as ChInputNumberComponent } from './lib/components/input-number/input-number.component';

// Rating
export { RatingComponent as ChRatingComponent } from './lib/components/rating/rating.component';

// Toggle
export { ChToggleComponent, ChToggleGroupComponent } from './lib/components/toggle/toggle.component';

// PinInput
export { PinInputComponent as ChPinInputComponent } from './lib/components/pin-input/pin-input.component';

// Kbd
export { KbdComponent as ChKbdComponent } from './lib/components/kbd/kbd.component';

// Timeline
export { ChTimelineComponent }      from './lib/components/timeline/timeline.component';
export type { ChTimelineItem }      from './lib/components/timeline/timeline.component';

// Statistic
export { StatisticComponent as ChStatisticComponent } from './lib/components/statistic/statistic.component';

// Empty
export { EmptyComponent as ChEmptyComponent } from './lib/components/empty/empty.component';

// Steps
export { StepsComponent as ChStepsComponent } from './lib/components/steps/steps.component';
export type { StepItem as ChStep }  from './lib/components/steps/steps.component';

// Segmented
export { SegmentedComponent as ChSegmentedComponent } from './lib/components/segmented/segmented.component';
export type { SegmentedOption as ChSegmentedOption } from './lib/components/segmented/segmented.component';

// Calendar
export { CalendarComponent as ChCalendarComponent } from './lib/components/calendar/calendar.component';

// Carousel
export { ChCarouselComponent, ChCarouselSlideComponent } from './lib/components/carousel/carousel.component';

// Tree
export { TreeComponent as ChTreeComponent } from './lib/components/tree/tree.component';
export type { TreeNode as ChTreeNode } from './lib/components/tree/tree.component';

// List
export { ChListComponent, ChListItemComponent } from './lib/components/list/list.component';

// AlertDialog
export { AlertDialogComponent as ChAlertDialogComponent } from './lib/components/alert-dialog/alert-dialog.component';

// Result
export { ResultComponent as ChResultComponent } from './lib/components/result/result.component';

// Watermark
export { WatermarkComponent as ChWatermarkComponent } from './lib/components/watermark/watermark.component';

// FloatButton
export { ChFloatButtonComponent, ChFloatButtonGroupComponent } from './lib/components/float-button/float-button.component';

// ImagePreview
export { ImagePreviewComponent as ChImagePreviewComponent } from './lib/components/image-preview/image-preview.component';

// Notification
export { ChNotificationContainerComponent, ChNotificationService } from './lib/components/notification/notification.component';
export type { ChNotificationData }  from './lib/components/notification/notification.component';

// Tour
export { ChTourComponent }          from './lib/components/tour/tour.component';
export type { ChTourStep }          from './lib/components/tour/tour.component';

// Upload
export { ChUploadComponent }        from './lib/components/upload/upload.component';
export type { ChUploadFile }        from './lib/components/upload/upload.component';

// Transfer
export { ChTransferComponent }      from './lib/components/transfer/transfer.component';
export type { ChTransferItem }      from './lib/components/transfer/transfer.component';

// Anchor
export { ChAnchorComponent, ChAnchorLinkComponent } from './lib/components/anchor/anchor.component';

// ColorPicker
export { ChColorPickerComponent }   from './lib/components/color-picker/color-picker.component';

// Cascader
export { ChCascaderComponent }      from './lib/components/cascader/cascader.component';
export type { ChCascaderOption }    from './lib/components/cascader/cascader.component';

// Mentions
export { ChMentionsComponent }      from './lib/components/mentions/mentions.component';
export type { ChMentionOption }     from './lib/components/mentions/mentions.component';

// TreeSelect
export { ChTreeSelectComponent }    from './lib/components/tree-select/tree-select.component';
export type { ChTreeSelectNode }    from './lib/components/tree-select/tree-select.component';

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
import { InputNumberComponent }    from './lib/components/input-number/input-number.component';
import { RatingComponent }         from './lib/components/rating/rating.component';
import { ChToggleComponent, ChToggleGroupComponent } from './lib/components/toggle/toggle.component';
import { PinInputComponent }       from './lib/components/pin-input/pin-input.component';
import { KbdComponent }            from './lib/components/kbd/kbd.component';
import { ChTimelineComponent }     from './lib/components/timeline/timeline.component';
import { StatisticComponent }      from './lib/components/statistic/statistic.component';
import { EmptyComponent }          from './lib/components/empty/empty.component';
import { StepsComponent }          from './lib/components/steps/steps.component';
import { SegmentedComponent }      from './lib/components/segmented/segmented.component';
import { CalendarComponent }       from './lib/components/calendar/calendar.component';
import { ChCarouselComponent, ChCarouselSlideComponent } from './lib/components/carousel/carousel.component';
import { TreeComponent }           from './lib/components/tree/tree.component';
import { ChListComponent, ChListItemComponent } from './lib/components/list/list.component';
import { AlertDialogComponent }    from './lib/components/alert-dialog/alert-dialog.component';
import { ResultComponent }         from './lib/components/result/result.component';
import { WatermarkComponent }      from './lib/components/watermark/watermark.component';
import { ChFloatButtonComponent, ChFloatButtonGroupComponent } from './lib/components/float-button/float-button.component';
import { ImagePreviewComponent }   from './lib/components/image-preview/image-preview.component';
import { ChNotificationContainerComponent } from './lib/components/notification/notification.component';
import { ChTourComponent }         from './lib/components/tour/tour.component';
import { ChUploadComponent }       from './lib/components/upload/upload.component';
import { ChTransferComponent }     from './lib/components/transfer/transfer.component';
import { ChAnchorComponent, ChAnchorLinkComponent } from './lib/components/anchor/anchor.component';
import { ChColorPickerComponent }  from './lib/components/color-picker/color-picker.component';
import { ChCascaderComponent }     from './lib/components/cascader/cascader.component';
import { ChMentionsComponent }     from './lib/components/mentions/mentions.component';
import { ChTreeSelectComponent }   from './lib/components/tree-select/tree-select.component';
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
  InputNumberComponent,
  RatingComponent,
  ChToggleComponent,
  ChToggleGroupComponent,
  PinInputComponent,
  KbdComponent,
  ChTimelineComponent,
  StatisticComponent,
  EmptyComponent,
  StepsComponent,
  SegmentedComponent,
  CalendarComponent,
  ChCarouselComponent,
  ChCarouselSlideComponent,
  TreeComponent,
  ChListComponent,
  ChListItemComponent,
  AlertDialogComponent,
  ResultComponent,
  WatermarkComponent,
  ChFloatButtonComponent,
  ChFloatButtonGroupComponent,
  ImagePreviewComponent,
  ChNotificationContainerComponent,
  ChTourComponent,
  ChUploadComponent,
  ChTransferComponent,
  ChAnchorComponent,
  ChAnchorLinkComponent,
  ChColorPickerComponent,
  ChCascaderComponent,
  ChMentionsComponent,
  ChTreeSelectComponent,
  ...CHAMELEON_STYLE_PROPS,
] as const;
