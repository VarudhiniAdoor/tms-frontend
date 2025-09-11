import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCalendar, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
