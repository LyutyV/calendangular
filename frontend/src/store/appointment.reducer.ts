// src/app/store/appointments/appointments.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { IAppointment } from '../app/models/calendar.interface';
import { AppointmentsActions } from './appointment.actions';

export interface AppointmentsState {
    appointments: IAppointment[];
}

const initialState: AppointmentsState = {
    appointments: [],
};

export const appointmentsReducer = createReducer(
    initialState,
    on(AppointmentsActions.loadAppointments, (state) => ({ ...state })),
    on(AppointmentsActions.addAppointment, (state, { appointment }) => ({
        ...state,
        appointments: [...state.appointments, appointment],
    })),
    on(AppointmentsActions.updateAppointment, (state, { id, changes }) => ({
        ...state,
        appointments: state.appointments.map((app) => (app.id === id ? { ...app, ...changes } : app)),
    })),
    on(AppointmentsActions.deleteAppointment, (state, { id }) => ({
        ...state,
        appointments: state.appointments.filter((app) => app.id !== id),
    }))
);
