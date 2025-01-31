import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { calendarReducer } from './store/reducers/calendar.reducer';
import { provideEffects } from '@ngrx/effects';
import { CalendarEffects } from './store/effects/calendar.effects';
import { calendarFeatureKey } from './store/actions/calendar.actions';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideStore({ [calendarFeatureKey]: calendarReducer }),
        provideEffects(CalendarEffects),
    ],
};
