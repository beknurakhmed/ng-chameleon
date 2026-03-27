import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { inject } from '@vercel/analytics';
import { environment } from './environments/environment';

// Inject Vercel Web Analytics with proper configuration
inject({
  mode: environment.production ? 'production' : 'development',
  debug: !environment.production,
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
