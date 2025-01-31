import { createReducer, on } from '@ngrx/store';
import { CalendarActionsGroup } from '../actions/calendar.actions';
import { ICalendarEvent } from '../../models/calendar.interface';

export interface CalendarState {
    events: ICalendarEvent[];
}

const initialState: CalendarState = {
    events: [],
};

export const calendarReducer = createReducer(
    initialState,

    on(CalendarActionsGroup.loadEventsSuccess, (state, { events }) => ({
        ...state,
        events,
    })),

    on(CalendarActionsGroup.addEvent, (state, { event }) => {
        return {
            ...state,
            events: [...state.events, event],
        };
    }),

    on(CalendarActionsGroup.updateEvent, (state, { event }) => ({
        ...state,
        events: state.events.map((e) => (e.id === event.id ? event : e)),
    })),

    on(CalendarActionsGroup.deleteEvent, (state, { id }) => ({
        ...state,
        events: state.events.filter((e) => e.id !== id),
    }))
);
