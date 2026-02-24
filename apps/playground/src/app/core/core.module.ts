import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

/**
 * CoreModule — imported ONCE in AppModule.
 * Contains singleton services, interceptors, guards.
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi:    true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule.');
    }
  }
}
