import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CalendarState } from '../reducers/calendar.reducer';
import { ICalendarEvent } from '../../models/calendar.interface';
import { calendarFeatureKey } from '../actions/calendar.actions';

export const selectCalendarState = createFeatureSelector<CalendarState>(calendarFeatureKey);

export const selectAllEvents = createSelector(selectCalendarState, (state) => state.events);

export const selectEventById = (eventId: string) => createSelector(selectAllEvents, (events: ICalendarEvent[]) => events.find((event) => event.id === eventId));
