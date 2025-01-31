import { Component, Input, Output, EventEmitter, OnInit, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CalendarService } from '../../services/calendar.service';
import { CalendarActionsGroup } from '../../store/actions/calendar.actions';
import { ICalendarEvent } from '../../models/calendar.interface';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CalendarState } from '../../store/reducers/calendar.reducer';
import { selectEventById } from '../../store/selector/calendar.selectors';
import { timeValidator } from '../../formValidators/time.validator';
import { overlapValidator } from '../../formValidators/overlap.validator';

@Component({
    standalone: true,
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatTimepickerModule, MatFormFieldModule, MatInputModule],
    providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class EventDetailsComponent implements OnInit {
    @Input() eventId!: string;
    sceduledEventSignal!: Signal<ICalendarEvent | undefined>;
    @Output() close = new EventEmitter<void>();

    editForm: FormGroup;

    previewStart: Date | null = null;
    previewEnd: Date | null = null;

    constructor(private fb: FormBuilder, private store: Store<{ Calendar: CalendarState }>, private calendarService: CalendarService) {
        this.editForm = this.fb.group(
            {
                id: [''],
                title: ['', Validators.required],
                description: ['', Validators.required],
                startTime: ['', Validators.required],
                endTime: ['', Validators.required],
            },
            {
                validators: [timeValidator, overlapValidator(this.calendarService)],
            }
        );
        effect(() => {
            const event = this.sceduledEventSignal();
            if (event) {
                this.editForm.patchValue({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    startTime: event.start,
                    endTime: event.end,
                });
            }
        });
    }

    ngOnInit() {
        this.sceduledEventSignal = this.store.selectSignal(selectEventById(this.eventId));
    }

    dragPreviewStartEnd(start: Date, end: Date) {
        this.previewStart = start;
        this.previewEnd = end;
    }

    onSave() {
        const { title, description, startTime, endTime } = this.editForm.value;
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        const updatedEvent: ICalendarEvent = {
            ...this.sceduledEventSignal()!,
            title,
            description,
            start: newStart,
            end: newEnd,
        };

        this.store.dispatch(CalendarActionsGroup.updateEvent({ event: updatedEvent }));
        this.close.emit();
    }

    onDelete() {
        this.store.dispatch(CalendarActionsGroup.deleteEvent({ id: this.eventId }));
        this.close.emit();
    }

    onCancel() {
        this.close.emit();
    }
}
