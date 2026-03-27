import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { inject } from '@vercel/analytics';

// Inject Vercel Web Analytics
inject();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
