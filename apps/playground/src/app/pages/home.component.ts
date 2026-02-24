import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAMELEON_COMPONENTS } from 'ng-chameleon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ...CHAMELEON_COMPONENTS],
  template: `
    <!-- Hero -->
    <div chBox p="16" rounded="2xl" bg="primary.50" mb="12" style="text-align:center">
      <div chStack spacing="6" align="center">
        <span style="font-size:4rem">🦎</span>

        <h1 chText fontSize="4xl" fontWeight="bold" color="primary">
          ng-chameleon
        </h1>

        <p chText fontSize="xl" color="gray.500" style="max-width:600px;margin:0 auto">
          One Angular library. Four design systems.
          React-level developer experience.
        </p>

        <div chFlex gap="3" justify="center">
          <ch-button size="lg" routerLink="/components">
            Explore components →
          </ch-button>
          <ch-button size="lg" variant="outline" routerLink="/themes">
            Theme gallery
          </ch-button>
        </div>
      </div>
    </div>

    <!-- Feature cards -->
    <div chGrid cols="3" gap="6" mb="12">

      <ch-card>
        <ch-card-body>
          <span style="font-size:2rem;display:block;margin-bottom:1rem">🎨</span>
          <p chText fontSize="lg" fontWeight="bold" mb="2">4 Design Systems</p>
          <p chText fontSize="sm" color="gray.500">
            Material, Chakra, Ant Design, Shadcn.
            Switch without rewriting any component code.
          </p>
        </ch-card-body>
      </ch-card>

      <ch-card>
        <ch-card-body>
          <span style="font-size:2rem;display:block;margin-bottom:1rem">✨</span>
          <p chText fontSize="lg" fontWeight="bold" mb="2">Style Props</p>
          <p chText fontSize="sm" color="gray.500">
            <code>chBox bg="primary.500" p="4"</code> — Chakra-style props
            directly in Angular templates. No Tailwind knowledge required.
          </p>
        </ch-card-body>
      </ch-card>

      <ch-card>
        <ch-card-body>
          <span style="font-size:2rem;display:block;margin-bottom:1rem">🔧</span>
          <p chText fontSize="lg" fontWeight="bold" mb="2">Angular CLI First</p>
          <p chText fontSize="sm" color="gray.500">
            <code>ng add ng-chameleon</code> and
            <code>ng g ng-chameleon:add button</code> —
            shadcn-style copy-paste approach.
          </p>
        </ch-card-body>
      </ch-card>

    </div>

    <!-- Code example -->
    <ch-card>
      <ch-card-header>Quick start</ch-card-header>
      <ch-card-body>
        <div chStack spacing="4">
          <div chBox bg="gray.900" p="4" rounded="md">
            <pre style="margin:0;color:#e2e8f0;font-size:0.875rem;font-family:var(--ch-font-mono)"><code>{{ installCode }}</code></pre>
          </div>
          <ch-alert status="info" variant="subtle">
            After install, all components automatically use your chosen design system.
            Switch theme at any time with zero rebuilds.
          </ch-alert>
        </div>
      </ch-card-body>
    </ch-card>
  `,
})
export class HomeComponent {
  readonly installCode = `# Install
ng add ng-chameleon
# → Choose theme: shadcn / chakra / material / antd

# Add components (shadcn-style)
ng g ng-chameleon:add button card input

# Use in template
<ch-button variant="solid" colorScheme="primary">Click me</ch-button>
<ch-card>
  <ch-card-header>Hello</ch-card-header>
  <ch-card-body>World</ch-card-body>
</ch-card>

# Style props
<div chBox bg="primary.500" p="4" rounded="lg">
  <span chText fontSize="xl" fontWeight="bold" color="white">Styled!</span>
</div>

# Switch theme at runtime
themeService.setTheme('material');  // instant, no rebuild`;
}
