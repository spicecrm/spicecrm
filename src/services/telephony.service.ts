/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';
import {broadcast} from './broadcast.service';
import {telephonyCallI} from "./interfaces.service";

declare var moment: any;

@Injectable()
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

    constructor(private broadcast: broadcast) {

        // subscribe to the logout so we can remove all open composers
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    private handleLogout(message) {
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
