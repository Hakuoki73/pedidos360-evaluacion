import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { switchMap } from 'rxjs/operators';

import { 
  MSAL_INSTANCE, 
  MSAL_GUARD_CONFIG, 
  MSAL_INTERCEPTOR_CONFIG,
  MsalService, 
  MsalGuard, 
  MsalBroadcastService, 
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { PublicClientApplication, BrowserCacheLocation, InteractionType } from '@azure/msal-browser';

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'd1a052a1-66c7-4847-b5e2-46fdb86c94f6',
      authority: 'https://pedido360seba2026.ciamlogin.com/39eb9615-c754-4ef1-96f8-4f61494df782', 
      redirectUri: 'http://localhost:4200',
      knownAuthorities: ['pedido360seba2026.ciamlogin.com']
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    // Pedimos el token institucional para nuestra propia app
    authRequest: { scopes: ['d1a052a1-66c7-4847-b5e2-46fdb86c94f6/.default'] }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // El interceptor adjuntará automáticamente el token correcto a las peticiones del backend
  protectedResourceMap.set('http://localhost:8080/api/', ['d1a052a1-66c7-4847-b5e2-46fdb86c94f6/.default']);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALAppInitializerFactory(msalService: MsalService) {
  return () => msalService.initialize().pipe(
    switchMap(() => msalService.handleRedirectObservable())
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: MSALAppInitializerFactory,
      deps: [MsalService],
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};