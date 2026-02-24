import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

interface SetThemeSchema {
  theme: 'chakra' | 'material' | 'antd' | 'shadcn';
}

const ALL_THEMES = ['chakra', 'material', 'antd', 'shadcn'] as const;

export function setTheme(options: SetThemeSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const { theme } = options;

    // 1. Update styles file — swap theme import
    updateStylesFile(tree, theme, context);

    // 2. Update app.config.ts — swap provideChameleon theme
    updateAppConfig(tree, theme, context);

    context.logger.info(`
🦎 Theme switched to "${theme}"

  The change is:
  - CSS-only for runtime (no rebuild needed)
  - Updated in your styles.css and app.config.ts
  - All existing components will now look like ${theme}

  To switch at runtime (without rebuild):
    themeService.setTheme('${theme}');
    `);

    return tree;
  };
}

function updateStylesFile(tree: Tree, newTheme: string, context: SchematicContext): void {
  const candidates = ['src/styles.css', 'src/styles.scss'];
  const stylesFile = candidates.find(f => tree.exists(f));
  if (!stylesFile) return;

  let content = tree.read(stylesFile)!.toString('utf-8');

  // Replace any existing theme import
  const themeImportRe = /@import ['"]ng-chameleon\/themes\/(?:chakra|material|antd|shadcn)\.css['"]/g;
  if (themeImportRe.test(content)) {
    content = content.replace(
      /@import ['"]ng-chameleon\/themes\/(?:chakra|material|antd|shadcn)\.css['"]/g,
      `@import 'ng-chameleon/themes/${newTheme}.css'`
    );
    tree.overwrite(stylesFile, content);
    context.logger.info(`  ✅ ${stylesFile} → theme updated to ${newTheme}`);
  }
}

function updateAppConfig(tree: Tree, newTheme: string, context: SchematicContext): void {
  const candidates = ['src/app/app.config.ts', 'src/app.config.ts'];
  const configFile = candidates.find(f => tree.exists(f));
  if (!configFile) return;

  let content = tree.read(configFile)!.toString('utf-8');

  // Replace theme in provideChameleon call
  const re = /provideChameleon\(\s*\{[^}]*theme\s*:\s*['"](?:chakra|material|antd|shadcn)['"]/g;
  if (re.test(content)) {
    content = content.replace(
      /(provideChameleon\(\s*\{[^}]*theme\s*:\s*)['"](?:chakra|material|antd|shadcn)['"]/,
      `$1'${newTheme}'`
    );
    tree.overwrite(configFile, content);
    context.logger.info(`  ✅ ${configFile} → theme updated to ${newTheme}`);
  }
}
