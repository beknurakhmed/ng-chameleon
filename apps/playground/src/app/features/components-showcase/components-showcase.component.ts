import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import type {
  SelectOption, BreadcrumbItem, TableColumn, ComboboxOption,
  ChartData, MenuItem,
} from 'ng-chameleon';
import { ChToastService }    from 'ng-chameleon';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector:    'pg-components-showcase',
  templateUrl: './components-showcase.component.html',
  styleUrls:   ['./components-showcase.component.scss'],
})
export class ComponentsShowcaseComponent {

  protected readonly i18n = inject(TranslationService);

  readonly loading       = signal(false);
  readonly modalOpen     = signal(false);
  readonly drawerOpen    = signal(false);
  readonly tags          = signal(['Angular', 'TypeScript', 'Tailwind', 'ng-chameleon']);
  readonly checkboxValue = signal(false);
  readonly switchValue   = signal(false);
  readonly progress      = signal(65);
  readonly selectedTab   = signal(0);
  readonly currentPage   = signal(1);
  readonly sliderValue   = signal(40);
  readonly dateValue     = signal<Date | null>(null);
  readonly comboValue    = signal<string | null>(null);

  // ── Static data ────────────────────────────────────────────────────────────
  readonly frameworkOptions: SelectOption[] = [
    { value: 'angular',    label: 'Angular' },
    { value: 'react',      label: 'React' },
    { value: 'vue',        label: 'Vue' },
    { value: 'svelte',     label: 'Svelte' },
    { value: 'solid',      label: 'SolidJS' },
  ];

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home',       link: '/' },
    { label: 'Components', link: '/components' },
    { label: 'Showcase' },
  ];

  // ── Table data ─────────────────────────────────────────────────────────────
  readonly tableColumns: TableColumn<{ name: string; role: string; status: string; score: number }>[] = [
    { key: 'name',   label: 'Name',   sortable: true  },
    { key: 'role',   label: 'Role',   sortable: true  },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'score',  label: 'Score',  sortable: true, align: 'right' },
  ];
  readonly tableData = [
    { name: 'Alice Johnson',  role: 'Frontend Dev',  status: 'Active',   score: 94 },
    { name: 'Bob Smith',      role: 'Backend Dev',   status: 'Active',   score: 87 },
    { name: 'Carol White',    role: 'Designer',      status: 'Inactive', score: 76 },
    { name: 'David Brown',    role: 'DevOps',        status: 'Active',   score: 91 },
    { name: 'Eve Davis',      role: 'QA Engineer',   status: 'Active',   score: 83 },
  ];

  // ── Combobox options ───────────────────────────────────────────────────────
  readonly languageOptions: ComboboxOption[] = [
    { value: 'ts',   label: 'TypeScript', group: 'Popular' },
    { value: 'js',   label: 'JavaScript', group: 'Popular' },
    { value: 'py',   label: 'Python',     group: 'Popular' },
    { value: 'rs',   label: 'Rust',       group: 'Systems' },
    { value: 'go',   label: 'Go',         group: 'Systems' },
    { value: 'java', label: 'Java',       group: 'Enterprise' },
    { value: 'kt',   label: 'Kotlin',     group: 'Enterprise' },
  ];

  // ── Chart data ─────────────────────────────────────────────────────────────
  readonly lineChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Revenue',  data: [42, 58, 45, 73, 62, 89] },
      { label: 'Expenses', data: [30, 40, 35, 50, 48, 60] },
    ],
  };

  readonly barChartData: ChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { label: 'Product A', data: [65, 78, 90, 82] },
      { label: 'Product B', data: [45, 55, 70, 88] },
    ],
  };

  readonly pieChartData: ChartData = {
    labels: ['Chakra', 'Material', 'Ant Design', 'Shadcn'],
    datasets: [{ label: 'Usage', data: [35, 28, 22, 15] }],
  };

  // ── Menu items ─────────────────────────────────────────────────────────────
  readonly menuItems: MenuItem[] = [
    { label: 'Edit profile', shortcut: '⌘E', action: () => this.toast.info('Edit profile') },
    { label: 'Settings',     shortcut: '⌘,', action: () => this.toast.info('Settings') },
    { divider: true },
    { label: 'Sign out',  danger: true, action: () => this.toast.warning('Signed out') },
  ];

  // ── Sections ───────────────────────────────────────────────────────────────
  readonly sections = [
    { id: 'buttons',      key: 'showcase.sections.buttons'        },
    { id: 'forms',        key: 'showcase.sections.forms'          },
    { id: 'advanced-forms', key: 'showcase.sections.advanced_forms' },
    { id: 'feedback',     key: 'showcase.sections.feedback'       },
    { id: 'data',         key: 'showcase.sections.data'           },
    { id: 'charts',       key: 'showcase.sections.charts'         },
    { id: 'navigation',   key: 'showcase.sections.navigation'     },
    { id: 'overlay',      key: 'showcase.sections.overlays'       },
    { id: 'layout',       key: 'layout'                           },
    { id: 'style-props',  key: 'Style Props'                      },
  ];

  // ── Form ───────────────────────────────────────────────────────────────────
  readonly demoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ChToastService,
  ) {
    this.demoForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  submitForm(): void {
    if (this.demoForm.valid) {
      this.loading.set(true);
      setTimeout(() => {
        this.loading.set(false);
        this.demoForm.reset();
      }, 1500);
    } else {
      this.demoForm.markAllAsTouched();
    }
  }

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(x => x !== tag));
  }

  increaseProgress(): void {
    this.progress.update(v => Math.min(100, v + 10));
  }

  resetProgress(): void {
    this.progress.set(0);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
