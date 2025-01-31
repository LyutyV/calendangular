import { createActionGroup, props } from '@ngrx/store';
import { IAppointment } from '../app/models/calendar.interface';

export const AppointmentsActions = createActionGroup({
    source: 'Appointments',
    events: {
        LoadAppointments: props<{ error?: any }>(),
        AddAppointment: props<{ appointment: IAppointment }>(),
        UpdateAppointment: props<{ id: string; changes: Partial<IAppointment> }>(),
        DeleteAppointment: props<{ id: string }>(),
    },
});
