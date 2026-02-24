import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CHAMELEON_COMPONENTS } from 'ng-chameleon';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, ...CHAMELEON_COMPONENTS],
  template: `
    <div chStack spacing="12">

      <!-- SECTION: Buttons -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Buttons</h2>

        <ch-card>
          <ch-card-header>Variants</ch-card-header>
          <ch-card-body>
            <div chFlex gap="3" wrap="wrap" mb="6">
              <ch-button variant="solid">Solid</ch-button>
              <ch-button variant="outline">Outline</ch-button>
              <ch-button variant="ghost">Ghost</ch-button>
              <ch-button variant="link">Link</ch-button>
              <ch-button variant="subtle">Subtle</ch-button>
            </div>

            <div chFlex gap="3" wrap="wrap" mb="6">
              <ch-button colorScheme="primary">Primary</ch-button>
              <ch-button colorScheme="success">Success</ch-button>
              <ch-button colorScheme="warning">Warning</ch-button>
              <ch-button colorScheme="error">Error</ch-button>
              <ch-button colorScheme="gray">Gray</ch-button>
            </div>

            <div chFlex gap="3" align="center" wrap="wrap">
              <ch-button size="xs">XSmall</ch-button>
              <ch-button size="sm">Small</ch-button>
              <ch-button size="md">Medium</ch-button>
              <ch-button size="lg">Large</ch-button>
            </div>
          </ch-card-body>
          <ch-card-footer>
            <ch-button [loading]="loading()" (clicked)="toggleLoading()">
              {{ loading() ? 'Saving...' : 'Save changes' }}
            </ch-button>
            <ch-button variant="outline" [disabled]="true">Disabled</ch-button>
          </ch-card-footer>
        </ch-card>
      </section>

      <!-- SECTION: Inputs -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Inputs</h2>

        <ch-card>
          <ch-card-header>Form Controls</ch-card-header>
          <ch-card-body>
            <div chStack spacing="4">
              <ch-input
                placeholder="Default (outline)"
                [formControl]="searchCtrl" />

              <ch-input
                variant="filled"
                placeholder="Filled variant"
                size="lg" />

              <ch-input
                variant="flushed"
                placeholder="Flushed variant" />

              <ch-input
                placeholder="With error"
                [invalid]="true"
                errorMessage="This field is required" />

              <ch-input
                placeholder="Disabled"
                [disabled]="true"
                helperText="This field is disabled" />
            </div>
          </ch-card-body>
          <ch-card-footer>
            <span chText fontSize="sm" color="gray.500">
              Value: "{{ searchCtrl.value }}"
            </span>
          </ch-card-footer>
        </ch-card>
      </section>

      <!-- SECTION: Badges & Tags -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Badges & Tags</h2>

        <ch-card>
          <ch-card-body>
            <div chStack spacing="4">
              <!-- Badges -->
              <div chFlex gap="2" wrap="wrap">
                <ch-badge colorScheme="primary">Primary</ch-badge>
                <ch-badge colorScheme="success">Success</ch-badge>
                <ch-badge colorScheme="warning">Warning</ch-badge>
                <ch-badge colorScheme="error">Error</ch-badge>
                <ch-badge colorScheme="info">Info</ch-badge>
                <ch-badge colorScheme="gray">Gray</ch-badge>
              </div>

              <div chFlex gap="2" wrap="wrap">
                <ch-badge variant="solid"   colorScheme="primary">Solid</ch-badge>
                <ch-badge variant="subtle"  colorScheme="primary">Subtle</ch-badge>
                <ch-badge variant="outline" colorScheme="primary">Outline</ch-badge>
              </div>

              <!-- Tags -->
              <div chFlex gap="2" wrap="wrap">
                <ch-tag *ngFor="let tag of tags()"
                  colorScheme="primary"
                  [closable]="true"
                  [label]="tag"
                  (closed)="removeTag(tag)">
                  {{ tag }}
                </ch-tag>
                <ch-button size="sm" variant="ghost" (clicked)="resetTags()">Reset tags</ch-button>
              </div>
            </div>
          </ch-card-body>
        </ch-card>
      </section>

      <!-- SECTION: Alerts -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Alerts</h2>

        <div chStack spacing="3">
          <ch-alert status="info"    title="Information" variant="subtle">
            This is an informational message.
          </ch-alert>
          <ch-alert status="success" title="Success!" variant="subtle">
            Your changes have been saved successfully.
          </ch-alert>
          <ch-alert status="warning" title="Warning" variant="subtle" [dismissible]="true">
            Please review before submitting.
          </ch-alert>
          <ch-alert status="error"   title="Error" variant="left-accent" [dismissible]="true">
            Something went wrong. Please try again.
          </ch-alert>
        </div>
      </section>

      <!-- SECTION: Avatars -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Avatars</h2>

        <ch-card>
          <ch-card-body>
            <div chStack spacing="4">
              <!-- Sizes -->
              <div chFlex gap="3" align="center">
                <ch-avatar name="John Doe"   size="xs" />
                <ch-avatar name="Jane Smith" size="sm" />
                <ch-avatar name="Bob Wilson" size="md" />
                <ch-avatar name="Alice Cooper" size="lg" />
                <ch-avatar name="Mark Davis" size="xl" />
              </div>

              <!-- With online badge -->
              <div chFlex gap="3">
                <ch-avatar name="Online User"  [showBadge]="true" badgeColor="online" />
                <ch-avatar name="Busy User"    [showBadge]="true" badgeColor="busy" />
                <ch-avatar name="Away User"    [showBadge]="true" badgeColor="away" />
                <ch-avatar name="Offline User" [showBadge]="true" badgeColor="offline" />
              </div>

              <!-- Avatar group -->
              <ch-avatar-group>
                <ch-avatar name="Alice A" />
                <ch-avatar name="Bob B" />
                <ch-avatar name="Charlie C" />
                <ch-avatar name="Dave D" />
              </ch-avatar-group>
            </div>
          </ch-card-body>
        </ch-card>
      </section>

      <!-- SECTION: Spinners & Skeletons -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Loading States</h2>

        <ch-card>
          <ch-card-body>
            <div chStack spacing="6">
              <!-- Spinners -->
              <div>
                <p chText fontSize="sm" color="gray.500" mb="3">Spinners</p>
                <div chFlex gap="4" align="center">
                  <ch-spinner size="xs" />
                  <ch-spinner size="sm" />
                  <ch-spinner size="md" />
                  <ch-spinner size="lg" />
                  <ch-spinner size="xl" />
                </div>
              </div>

              <!-- Skeleton -->
              <div>
                <p chText fontSize="sm" color="gray.500" mb="3">Skeleton</p>
                <div chStack spacing="3" maxW="md">
                  <div chFlex gap="3" align="center">
                    <ch-skeleton height="3rem" width="3rem" borderRadius="full" />
                    <div chStack spacing="2" flex="1">
                      <ch-skeleton height="0.875rem" width="80%" />
                      <ch-skeleton height="0.875rem" width="60%" />
                    </div>
                  </div>
                  <ch-skeleton-text [noOfLines]="3" />
                </div>
              </div>
            </div>
          </ch-card-body>
        </ch-card>
      </section>

      <!-- SECTION: Style Props Demo -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Style Props</h2>

        <ch-card>
          <ch-card-header>chBox / chFlex / chText in action</ch-card-header>
          <ch-card-body>
            <div chBox bg="primary.50" p="6" rounded="lg" border="1" borderColor="primary.200">

              <p chText fontSize="lg" fontWeight="bold" color="primary" mb="4">
                Box with primary color tokens
              </p>

              <div chFlex gap="4" direction="row" wrap="wrap">
                <div chBox bg="success" p="3" rounded="md">
                  <span chText color="white" fontSize="sm" fontWeight="medium">Success box</span>
                </div>
                <div chBox bg="warning" p="3" rounded="md">
                  <span chText color="white" fontSize="sm" fontWeight="medium">Warning box</span>
                </div>
                <div chBox bg="error" p="3" rounded="md">
                  <span chText color="white" fontSize="sm" fontWeight="medium">Error box</span>
                </div>
              </div>

            </div>
          </ch-card-body>
        </ch-card>
      </section>

      <!-- SECTION: Dividers -->
      <section>
        <h2 chText fontSize="2xl" fontWeight="bold" mb="6">Dividers</h2>

        <ch-card>
          <ch-card-body>
            <ch-divider />
            <div py="4">Some content above</div>
            <ch-divider label="OR" />
            <div py="4">Some content below</div>
            <ch-divider label="Section break" labelPosition="left" />
          </ch-card-body>
        </ch-card>
      </section>

    </div>
  `,
})
export class ComponentsComponent {
  readonly searchCtrl = new FormControl('');
  readonly loading = signal(false);
  readonly tags = signal(['Angular', 'TypeScript', 'Tailwind', 'ng-chameleon']);

  toggleLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  resetTags(): void {
    this.tags.set(['Angular', 'TypeScript', 'Tailwind', 'ng-chameleon']);
  }
}
