import { ApplicationConfig, provideZoneChangeDetection, InjectionToken } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';

import { appRoutes } from './app.routes';

export const APP_CONFIG = new InjectionToken('APP_CONFIG');

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        provideRouter(appRoutes),
        { provide: APP_CONFIG, useValue: environment.appConfig },
    ],
};