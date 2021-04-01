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
 * @module ModuleGSuite
 */
import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject} from "rxjs";

declare var _: any;

/**
 * Handle the communication between the wrapper and the system
 */
@Injectable()
export class GSuiteBrokerService implements OnDestroy {
    /**
     * holds the message update event listener
     */
    private messageUpdateListener;

    /**
     * subject requests instance
     */
    private requests = {};

    /**
     * define an observable to exchange data between the system and the wrapper
     * @param messageType
     * @param data
     */
    public submitRequest(messageType: string, data?): Observable<any> {

        const response = new Subject();
        const id = _.uniqueId();
        let messageData = {source: 'SpiceCRM', messageType, id, ...data};
        if (!!data) {
            messageData = {...messageData, ...data};
        }

        this.requests[id] = response;

        const listener = e => {
            if (e.data.source != 'GSuite' || e.data.messageType != messageType || e.data.id != id) return;
            response.next(e.data.response);
            response.complete();
            window.removeEventListener('message', listener);
        };
        window.addEventListener('message', listener);
        window.top.postMessage(messageData, '*');

        return response.asObservable();
    }

    /**
     * add event listener on window to handle the incoming message changes from GSuite
     */
    public gSuiteUpdatesEmitter(): Observable<any> {
        const response = new Subject();

        this.messageUpdateListener = e => {
            if (e.data.source != 'GSuite' || e.data.messageType != 'messageUpdate') return;
            response.next(e.data.response);
        };
        window.addEventListener('message', this.messageUpdateListener);

        return response.asObservable();
    }

    /**
     * remove message update listener
     */
    public ngOnDestroy() {
        window.removeEventListener('message', this.messageUpdateListener);
    }
}
