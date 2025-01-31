import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap, switchMap } from 'rxjs';
import { CalendarActionsGroup } from '../actions/calendar.actions';
import { CalendarService } from '../../services/calendar.service';

@Injectable()
export class CalendarEffects {
    private actions$: Actions = inject(Actions);

    loadEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CalendarActionsGroup.loadEvents),
            switchMap(() => {
                const events = this.calendarService.loadEventsFromSession();
                return of(CalendarActionsGroup.loadEventsSuccess({ events }));
            })
        )
    );

    persistEvents$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CalendarActionsGroup.addEvent, CalendarActionsGroup.updateEvent, CalendarActionsGroup.deleteEvent),
                tap(() => {
                    this.calendarService.saveEventsToSession();
                })
            ),
        { dispatch: false }
    );

    constructor(private calendarService: CalendarService) {}
}
