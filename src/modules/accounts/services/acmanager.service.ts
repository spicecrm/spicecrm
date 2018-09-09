import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class ACManagerService {
    contactccdetails: {} = {};
    contactCCDetails$: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    get contactCCDetails() {
        return this.contactccdetails;
    }

    set contactCCDetails(details) {
        this.contactccdetails = details;
        this.contactCCDetails$.emit(details);
    }
}