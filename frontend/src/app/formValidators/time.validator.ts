import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = new Date(control.get('startTime')?.value);
    const endTime = new Date(control.get('endTime')?.value);

    if (endTime.getTime() - startTime.getTime() < 5 * 60_000) {
        return {
            invalidTimeRange: true,
        };
    }
    return null;
};
