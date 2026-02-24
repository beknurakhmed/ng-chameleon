import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'components',
    loadChildren: () =>
      import('./features/components-showcase/components-showcase.module')
        .then(m => m.ComponentsShowcaseModule),
  },
  {
    path: 'themes',
    loadChildren: () =>
      import('./features/themes-showcase/themes-showcase.module')
        .then(m => m.ThemesShowcaseModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling:           'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
