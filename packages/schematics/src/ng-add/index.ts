import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
} from '@angular-devkit/schematics/tasks';
import * as path from 'path';

interface NgAddSchema {
  theme: 'chakra' | 'material' | 'antd' | 'shadcn';
  colorMode: 'light' | 'dark' | 'system';
  styleProps: boolean;
  tailwind: boolean;
  project?: string;
}

export function ngAdd(options: NgAddSchema): Rule {
  return chain([
    addDependencies(options),
    configureStyles(options),
    updateAppConfig(options),
    printSuccess(options),
  ]);
}

function addDependencies(_options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = 'package.json';
    if (!tree.exists(pkgPath)) {
      context.logger.error('Could not find package.json');
      return tree;
    }

    const pkg = JSON.parse(tree.read(pkgPath)!.toString('utf-8'));
    pkg.dependencies = pkg.dependencies ?? {};
    pkg.dependencies['ng-chameleon'] = '^0.1.0';
    pkg.dependencies['@angular/cdk'] = pkg.dependencies['@angular/cdk'] ?? '^17.0.0';

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    context.addTask(new NodePackageInstallTask());
    return tree;
  };
}

function configureStyles(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Find the main styles file
    const angularJson = getAngularJson(tree);
    if (!angularJson) return tree;

    const projectName = options.project ?? getDefaultProject(angularJson);
    const project = angularJson.projects?.[projectName];
    if (!project) return tree;

    const stylesFile = findStylesFile(tree, project);
    if (!stylesFile) {
      context.logger.warn('Could not locate styles file. Add theme import manually.');
      return tree;
    }

    // Add theme import at the top of styles
    const existing = tree.read(stylesFile)?.toString('utf-8') ?? '';
    const themeImport = `@import 'ng-chameleon/themes/${options.theme}.css';\n`;

    if (!existing.includes('ng-chameleon/themes')) {
      tree.overwrite(stylesFile, themeImport + existing);
      context.logger.info(`✅ Theme "${options.theme}" imported in ${stylesFile}`);
    }

    return tree;
  };
}

function updateAppConfig(options: NgAddSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Look for app.config.ts
    const configCandidates = [
      'src/app/app.config.ts',
      'src/app.config.ts',
    ];

    const configFile = configCandidates.find(f => tree.exists(f));
    if (!configFile) {
      context.logger.warn(
        'Could not find app.config.ts. Add provideChameleon() manually:\n\n' +
        `  import { provideChameleon } from 'ng-chameleon';\n` +
        `  providers: [provideChameleon({ theme: '${options.theme}', colorMode: '${options.colorMode}' })]`
      );
      return tree;
    }

    let content = tree.read(configFile)!.toString('utf-8');

    // Add import
    if (!content.includes('provideChameleon')) {
      content = `import { provideChameleon } from 'ng-chameleon';\n` + content;

      // Insert into providers array
      content = content.replace(
        /providers:\s*\[/,
        `providers: [\n    provideChameleon({ theme: '${options.theme}', colorMode: '${options.colorMode}' }),`
      );

      tree.overwrite(configFile, content);
      context.logger.info(`✅ provideChameleon() added to ${configFile}`);
    }

    return tree;
  };
}

function printSuccess(options: NgAddSchema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info(`
╔════════════════════════════════════════════════════╗
║       🦎 ng-chameleon installed successfully!      ║
╚════════════════════════════════════════════════════╝

  Theme:       ${options.theme}
  Color mode:  ${options.colorMode}
  Style props: ${options.styleProps ? 'enabled' : 'disabled'}

Next steps:
  Add a component:  ng g ng-chameleon:add button
  Use in template:  <ch-button variant="solid">Click me</ch-button>

  Switch theme at runtime:
    import { ChameleonThemeService } from 'ng-chameleon';
    themeService.setTheme('material');

Docs: https://ng-chameleon.dev
    `);
    return _tree;
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getAngularJson(tree: Tree): any {
  const angularJsonPath = 'angular.json';
  if (!tree.exists(angularJsonPath)) return null;
  return JSON.parse(tree.read(angularJsonPath)!.toString('utf-8'));
}

function getDefaultProject(angularJson: any): string {
  return angularJson.defaultProject ?? Object.keys(angularJson.projects ?? {})[0] ?? '';
}

function findStylesFile(tree: Tree, project: any): string | null {
  const buildOptions = project?.architect?.build?.options;
  if (!buildOptions) return null;

  const styles = buildOptions.styles;
  if (Array.isArray(styles) && styles.length > 0) {
    const first = typeof styles[0] === 'string' ? styles[0] : styles[0]?.input;
    if (first && tree.exists(first)) return first;
  }

  // Fallback: look for common locations
  const candidates = ['src/styles.css', 'src/styles.scss', 'src/styles.sass'];
  return candidates.find(c => tree.exists(c)) ?? null;
}
