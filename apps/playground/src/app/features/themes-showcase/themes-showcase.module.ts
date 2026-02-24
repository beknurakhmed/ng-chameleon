import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ThemesShowcaseRoutingModule } from './themes-showcase-routing.module';
import { ThemesShowcaseComponent } from './themes-showcase.component';

@NgModule({
  declarations: [ThemesShowcaseComponent],
  imports: [
    SharedModule,
    ThemesShowcaseRoutingModule,
  ],
})
export class ThemesShowcaseModule {}
