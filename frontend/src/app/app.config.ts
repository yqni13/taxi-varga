import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CustomTranslateLoader } from '../../public/assets/i18n/custom-translate-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { appHttpInterceptor } from './app.http.interceptor';
import { authInterceptorFn } from './app.auth.interceptor';
import { ThemeHandlerService } from './shared/services/theme-handler.service';

export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslateLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideAppInitializer(() => {
      const themeHandler = inject(ThemeHandlerService);
      themeHandler.initTheme();
    }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({scrollPositionRestoration: "top"})
    ),
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
