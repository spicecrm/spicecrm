/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class popup {
    public closePopup$: EventEmitter<boolean>;

    constructor() {
        this.closePopup$ = new EventEmitter<boolean>();
    }
    public close(): void {
        this.closePopup$.emit(true);
    }
}
