import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsShowcaseComponent } from './components-showcase.component';

const routes: Routes = [
  { path: '', component: ComponentsShowcaseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsShowcaseRoutingModule {}
