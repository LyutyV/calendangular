import { Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICalendarEvent } from '../models/calendar.interface';
import { CalendarState } from '../store/reducers/calendar.reducer';

@Injectable({
    providedIn: 'root',
})
export class CalendarService {
    eventsSignal = signal<ICalendarEvent[]>([]);

    constructor(private store: Store<{ Calendar: CalendarState }>) {
        this.store
            .select((state) => {
                if (!state || !state.Calendar) return [];
                return state.Calendar.events;
            })
            .subscribe((events) => {
                this.eventsSignal.set(events);
            });
    }

    loadEventsFromSession(): ICalendarEvent[] {
        const raw = sessionStorage.getItem('myCalendarEvents');
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw).map((obj: any) => ({
            ...obj,
            start: new Date(obj.start),
            end: new Date(obj.end),
        }));
        return parsed;
    }

    saveEventsToSession(): void {
        const events = this.eventsSignal();
        sessionStorage.setItem('myCalendarEvents', JSON.stringify(events));
    }

    hasOverlap(eventId: string | null, start: Date, end: Date): boolean {
        const existing: ICalendarEvent[] = this.eventsSignal();
        return existing.some((e) => {
            if (eventId && e.id === eventId) return false;
            if (start.getTime() === e.end.getTime()) return false;
            if (end.getTime() === e.start.getTime()) return false;
            return start < e.end && end > e.start;
        });
    }

    public roundTo5(date: Date): Date {
        const MILLISECONDS_PER_MINUTE = 1000 * 60;
        const FIVE_MINUTES_MS = MILLISECONDS_PER_MINUTE * 5;
        return new Date(Math.round(date.getTime() / FIVE_MINUTES_MS) * FIVE_MINUTES_MS);
    }
}
