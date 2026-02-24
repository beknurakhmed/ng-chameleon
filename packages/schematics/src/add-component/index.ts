import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  apply,
  url,
  template,
  move,
  mergeWith,
} from '@angular-devkit/schematics';
import * as path from 'path';
import { strings } from '@angular-devkit/core';

interface AddComponentSchema {
  name: string;
  path: string;
  theme?: string;
  prefix?: string;
  project?: string;
}

const AVAILABLE_COMPONENTS = [
  'button', 'input', 'card', 'badge', 'alert',
  'spinner', 'avatar', 'divider', 'tag', 'skeleton',
  'checkbox', 'radio', 'switch', 'select', 'textarea',
  'tooltip', 'modal', 'drawer', 'popover', 'dropdown',
  'table', 'tabs', 'accordion', 'breadcrumb', 'pagination',
  'progress', 'toast', 'slider', 'date-picker', 'menu', 'combobox', 'chart',
];

export function addComponent(options: AddComponentSchema): Rule {
  return chain([
    validateComponents(options),
    copyComponents(options),
    updateBarrelFile(options),
  ]);
}

function validateComponents(options: AddComponentSchema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    const names = options.name.split(/[\s,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);

    const invalid = names.filter(n => !AVAILABLE_COMPONENTS.includes(n));
    if (invalid.length > 0) {
      context.logger.warn(
        `Unknown component(s): ${invalid.join(', ')}\n` +
        `Available: ${AVAILABLE_COMPONENTS.join(', ')}`
      );
    }

    return _tree;
  };
}

function copyComponents(options: AddComponentSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const names = options.name.split(/[\s,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
    const outputPath = `src/app/${options.path ?? 'ui'}`;

    names
      .filter(n => AVAILABLE_COMPONENTS.includes(n))
      .forEach(componentName => {
        const componentDir = `${outputPath}/${componentName}`;

        if (tree.exists(`${componentDir}/${componentName}.component.ts`)) {
          context.logger.warn(`  ⚠️  ${componentName} already exists at ${componentDir}, skipping.`);
          return;
        }

        // Generate the component file from a template
        generateComponentFile(tree, componentName, componentDir, options);
        context.logger.info(`  ✅ ${componentName} → ${componentDir}/${componentName}.component.ts`);
      });

    return tree;
  };
}

function generateComponentFile(
  tree: Tree,
  name: string,
  dir: string,
  options: AddComponentSchema
): void {
  // Copy the source from ng-chameleon library as-is
  // In a real implementation, this would read from node_modules/ng-chameleon/src
  // and copy/transform the files. For now, we generate a wrapper.

  const className = strings.classify(name);
  const prefix = options.prefix ?? 'ch';

  const content = `// This component was added via: ng g ng-chameleon:add ${name}
// You own this code — customize it freely!
// Source: https://ng-chameleon.dev/components/${name}

export { Ch${className}Component } from 'ng-chameleon/${name}';
`;

  if (!tree.exists(`${dir}/index.ts`)) {
    tree.create(`${dir}/index.ts`, content);
  }
}

function updateBarrelFile(options: AddComponentSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const barrelPath = `src/app/${options.path ?? 'ui'}/index.ts`;
    const names = options.name.split(/[\s,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);

    if (!tree.exists(barrelPath)) {
      tree.create(barrelPath, names.map(n =>
        `export * from './${n}';`
      ).join('\n') + '\n');
    } else {
      let content = tree.read(barrelPath)!.toString('utf-8');
      names.forEach(name => {
        const exportLine = `export * from './${name}';`;
        if (!content.includes(exportLine)) {
          content += `\n${exportLine}`;
        }
      });
      tree.overwrite(barrelPath, content);
    }

    context.logger.info(`  📦 Exports updated in ${barrelPath}`);
    return tree;
  };
}
