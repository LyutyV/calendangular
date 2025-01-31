import { Component, Input, ViewContainerRef, ComponentRef, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { ICalendarEvent } from '../../models/calendar.interface';
import { CalendarService } from '../../services/calendar.service';
import { CalendarActionsGroup } from '../../store/actions/calendar.actions';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { CalendarState } from '../../store/reducers/calendar.reducer';
import { EventDetailsService } from '../../services/event-details.service';

@Component({
    standalone: true,
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss'],
    imports: [CommonModule, CdkDrag],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent {
    @Input() sceduledEvent!: ICalendarEvent;
    private detailsRef?: ComponentRef<EventDetailsComponent>;
    private readonly MILISECONDS_IN_MINUTE = 60000;
    private readonly MINUTES_IN_HOUR = 60;
    readonly HOUR_HEIGHT_PX = 40;

    newStartTime: Date | null = null;
    newEndTime: Date | null = null;

    constructor(
        private store: Store<{ Calendar: CalendarState }>,
        private calendarService: CalendarService,
        private detailsService: EventDetailsService,
        private viewContainerRef: ViewContainerRef
    ) {}

    get topPosition(): number {
        const hour = this.sceduledEvent.start.getHours();
        const minute = this.sceduledEvent.start.getMinutes();
        const hourPositionInPixels = hour * this.HOUR_HEIGHT_PX;
        const minutePositionInPixels = (minute / this.MINUTES_IN_HOUR) * this.HOUR_HEIGHT_PX;
        const topPositionInPixels = hourPositionInPixels + minutePositionInPixels;
        return topPositionInPixels;
    }
    get eventBlockHeight(): number {
        const durationMinutes = (this.sceduledEvent.end.getTime() - this.sceduledEvent.start.getTime()) / this.MILISECONDS_IN_MINUTE;
        return (durationMinutes / this.MINUTES_IN_HOUR) * this.HOUR_HEIGHT_PX;
    }

    openDetails(evt?: MouseEvent) {
        evt?.stopPropagation();

        if (this.detailsRef) {
            this.detailsRef?.destroy();
            this.detailsRef = undefined;
        }

        this.detailsRef = this.viewContainerRef.createComponent(EventDetailsComponent);
        this.detailsRef.instance.eventId = this.sceduledEvent.id;

        this.detailsService.setActive(this.detailsRef);

        this.detailsRef.instance.close.subscribe(() => {
            this.detailsRef?.destroy();
            this.detailsRef = undefined;
        });
    }

    onDragMoved(event: CdkDragMove) {
        const shiftY = event.distance.y;
        const newStartTime = new Date(this.sceduledEvent.start.getTime() + this.pixelsToMinutes(shiftY) * this.MILISECONDS_IN_MINUTE);
        const roundedTo5NewStartTime = this.calendarService.roundTo5(newStartTime);
        const duration = this.sceduledEvent.end.getTime() - this.sceduledEvent.start.getTime();
        const roundedTo5NewEndTime = new Date(roundedTo5NewStartTime.getTime() + duration);
        if (this.detailsRef && this.newStartTime?.getMinutes() !== roundedTo5NewStartTime.getMinutes()) {
            this.newStartTime = roundedTo5NewStartTime;
            this.newEndTime = roundedTo5NewEndTime;
            this.detailsRef.instance.dragPreviewStartEnd(this.newStartTime, this.newEndTime);
        }
    }

    onDragEnd(event: CdkDragEnd) {
        if (this.calendarService.hasOverlap(this.sceduledEvent.id, this.newStartTime!, this.newEndTime!)) {
            this.newStartTime = null;
            this.newEndTime = null;
            this.detailsRef?.instance.dragPreviewStartEnd(this.newStartTime!, this.newEndTime!);
            const eventElement = event.source.getRootElement();
            eventElement.style.top = `${this.topPosition}px`;
            return;
        }

        this.store.dispatch(
            CalendarActionsGroup.updateEvent({
                event: { ...this.sceduledEvent, start: this.newStartTime!, end: this.newEndTime! },
            })
        );
        this.newStartTime = null;
        this.newEndTime = null;
        this.detailsRef?.instance.dragPreviewStartEnd(this.newStartTime!, this.newEndTime!);
    }

    private pixelsToMinutes(y: number): number {
        return (y / this.HOUR_HEIGHT_PX) * this.MINUTES_IN_HOUR;
    }
}
