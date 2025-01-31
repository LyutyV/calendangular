import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CalendarService } from '../services/calendar.service';

export function overlapValidator(calendarService: CalendarService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const id = control.get('id')?.value || null;
        const startTime = control.get('startTime')?.value;
        const endTime = control.get('endTime')?.value;

        if (startTime && endTime && calendarService.hasOverlap(id, startTime, endTime)) {
            return {
                overlapTimeRange: true,
            };
        }
        return null;
    };
}
