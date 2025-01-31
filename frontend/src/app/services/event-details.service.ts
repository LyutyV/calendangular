import { Injectable, ComponentRef, signal } from '@angular/core';
import { EventDetailsComponent } from '../components/event-details/event-details.component';

@Injectable({
    providedIn: 'root',
})
export class EventDetailsService {
    private activeDetailsRef = signal<ComponentRef<EventDetailsComponent> | null>(null);

    setActive(detailsRef: ComponentRef<EventDetailsComponent>) {
        if (this.activeDetailsRef()) {
            this.activeDetailsRef()?.destroy();
        }
        this.activeDetailsRef.set(detailsRef);
    }

    clear() {
        this.activeDetailsRef()?.instance.close.emit();
        this.activeDetailsRef.set(null);
    }
}
