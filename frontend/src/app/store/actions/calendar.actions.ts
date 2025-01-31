import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICalendarEvent } from '../../models/calendar.interface';

export const calendarFeatureKey = 'Calendar';

export const CalendarActionsGroup = createActionGroup({
    source: calendarFeatureKey,
    events: {
        LoadEvents: emptyProps(),
        LoadEventsSuccess: props<{ events: ICalendarEvent[] }>(),
        AddEvent: props<{ event: ICalendarEvent }>(),
        UpdateEvent: props<{ event: ICalendarEvent }>(),
        DeleteEvent: props<{ id: string }>(),
    },
});
