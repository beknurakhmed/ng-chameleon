import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideChameleon } from 'ng-chameleon';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule }       from './core/core.module';
import { SharedModule }     from './shared/shared.module';
import { LayoutModule }     from './layout/layout.module';
import { AppComponent }     from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    LayoutModule,
  ],
  providers: [
    provideChameleon({
      theme:     'shadcn',
      colorMode: 'system',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
