import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CustomTranslateLoader } from '../../public/assets/i18n/custom-translate-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { appHttpInterceptor } from './app.http.interceptor';
import { authInterceptorFn } from './app.auth.interceptor';

export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslateLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withPreloading(PreloadAllModules)), 
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        appHttpInterceptor,
        authInterceptorFn
      ]),
      
    ),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    })),
  ]
};
