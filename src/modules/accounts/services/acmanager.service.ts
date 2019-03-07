/**
 * @module ModuleAccounts
 */
import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class ACManagerService {
    public contactccdetails: {} = {};
    public contactCCDetails$: EventEmitter<any> = new EventEmitter<any>();

    get contactCCDetails() {
        return this.contactccdetails;
    }

    set contactCCDetails(details) {
        this.contactccdetails = details;
        this.contactCCDetails$.emit(details);
    }
}
