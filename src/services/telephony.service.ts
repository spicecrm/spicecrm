/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';
import {broadcast} from './broadcast.service';
import {telephonyCallI} from "./interfaces.service";
import {BehaviorSubject} from "rxjs";

declare var moment: any;

@Injectable({
    providedIn: 'root'
})
export class telephony {

    /**
     * a boolean field that indicates if the telephony integration is active.
     * This is to be set by the telephony specific component
     */
    public isActive: boolean = false;

    /**
     * the current calls
     */
    public calls: telephonyCallI[] = [];

    /**
     * emits when a MSISDN should be called
     */
    public initiateCall$: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits if a call shoudl be terminated
     */
    public terminateCall$: EventEmitter<telephonyCallI> = new EventEmitter<telephonyCallI>();

    /**
     * actions that are possible. needs to be set by the call listener to enable thee actions
     */
    public actions: any = {
        hangup: false,
        transfer: false
    };

    constructor(public broadcast: broadcast) {

        // subscribe to the logout so we can remove all open composers
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    public handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.calls = [];
            this.isActive = false;
        }
    }



    /**
     * initiate the calling of an msisdn
     *
     * @param msidsn
     */
    public initiateCall(msisdn: string, relatedrecord?: any) {
        this.initiateCall$.emit({msisdn: msisdn, relatedid: relatedrecord.relatedid, relatedmodule: relatedrecord.relatedmodule, relateddata: relatedrecord.relateddata});
    }

    /**
     * emits that a call with a given id shoudl be terminated
     * @param callid
     */
    public terminateCall(callid) {
        let call = this.calls.find(c => c.id == callid || c.callid == callid);
        if (call) {
            this.terminateCall$.emit(call);
        }
    }

    /**
     * removes a call by the id eiehter internal or external
     * @param callid
     */
    public removeCallById(callid: string) {
        let index = this.calls.findIndex(c => c.id == callid || c.callid == callid);
        if (index >= 0) {
            this.calls.splice(index, 1);
        }
    }

}
