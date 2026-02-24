import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemesShowcaseComponent } from './themes-showcase.component';

const routes: Routes = [
  { path: '', component: ThemesShowcaseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemesShowcaseRoutingModule {}
