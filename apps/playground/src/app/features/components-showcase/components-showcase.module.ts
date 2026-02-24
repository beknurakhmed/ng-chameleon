import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsShowcaseRoutingModule } from './components-showcase-routing.module';
import { ComponentsShowcaseComponent } from './components-showcase.component';

@NgModule({
  declarations: [ComponentsShowcaseComponent],
  imports: [SharedModule, ComponentsShowcaseRoutingModule],
})
export class ComponentsShowcaseModule {}
