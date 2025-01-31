import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';

// CDK DragDrop (для використання директиви cdkDrag у під-компонентах)
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CalendarState } from '../../store/reducers/calendar.reducer';
import { CalendarActionsGroup } from '../../store/actions/calendar.actions';

import { CalendarService } from '../../services/calendar.service';
import { ICalendarEvent } from '../../models/calendar.interface';
import { EventComponent } from '../event/event.component';
import { timeValidator } from '../../formValidators/time.validator';
import { overlapValidator } from '../../formValidators/overlap.validator';

@Component({
    standalone: true,
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        DragDropModule,
        EventComponent,
        MatDatepickerModule,
        MatTimepickerModule,
    ],
    providers: [CalendarService, provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
    timeSlots: number[] = [];
    addEventForm: FormGroup;
    selectedDate = signal(new Date());
    eventsSignal: WritableSignal<ICalendarEvent[]>;

    constructor(private fb: FormBuilder, private store: Store<{ Calendar: CalendarState }>, private calendarService: CalendarService) {
        for (let i = 0; i < 25; i++) {
            this.timeSlots.push(i);
        }
        this.eventsSignal = this.calendarService.eventsSignal;
        this.addEventForm = this.fb.group(
            {
                title: ['', Validators.required],
                description: ['', Validators.required],
                startTime: ['', Validators.required],
                endTime: ['', Validators.required],
            },
            {
                validators: [timeValidator, overlapValidator(this.calendarService)],
            }
        );
    }

    ngOnInit() {
        this.store.dispatch(CalendarActionsGroup.loadEvents());
    }

    goToToday() {
        this.selectedDate.set(new Date());
    }

    onCreateEvent() {
        const { title, description, startTime, endTime } = this.addEventForm.value;
        const start = new Date(this.selectedDate().setHours(startTime.getHours(), startTime.getMinutes()));
        const end = new Date(this.selectedDate().setHours(endTime.getHours(), endTime.getMinutes()));

        const newEvent = {
            id: Date.now().toString(),
            title,
            description,
            start,
            end,
        };
        this.store.dispatch(CalendarActionsGroup.addEvent({ event: newEvent }));
        this.addEventForm.reset();
    }

    public sortedEvents = computed(() => {
        return [...this.eventsSignal()].filter((event) => this.isEventOnSelectedDate(event)).sort((a, b) => a.start.getTime() - b.start.getTime());
    });

    private isEventOnSelectedDate(event: ICalendarEvent): boolean {
        const selected = this.selectedDate();
        return event.start.getFullYear() === selected.getFullYear() && event.start.getMonth() === selected.getMonth() && event.start.getDate() === selected.getDate();
    }

    public trackBySlot(index: number, slot: number) {
        return slot;
    }

    public trackByEvent(index: number, event: ICalendarEvent) {
        return event.id;
    }
}
