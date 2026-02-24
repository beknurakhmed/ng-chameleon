export { ChBoxDirective }   from './ch-box.directive';
export { ChFlexDirective }  from './ch-flex.directive';
export { ChGridDirective }  from './ch-grid.directive';
export { ChTextDirective }  from './ch-text.directive';
export { ChStackDirective } from './ch-stack.directive';

import { ChBoxDirective }   from './ch-box.directive';
import { ChFlexDirective }  from './ch-flex.directive';
import { ChGridDirective }  from './ch-grid.directive';
import { ChTextDirective }  from './ch-text.directive';
import { ChStackDirective } from './ch-stack.directive';

/** All style-prop directives in one array for easy import */
export const CHAMELEON_STYLE_PROPS = [
  ChBoxDirective,
  ChFlexDirective,
  ChGridDirective,
  ChTextDirective,
  ChStackDirective,
] as const;
