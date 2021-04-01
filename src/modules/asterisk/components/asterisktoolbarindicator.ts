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
 * @module ModuleAsterisk
 */
import {Component, OnDestroy} from '@angular/core';

/**
 * @ignore
 */
declare var socketIo: any;

import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {telephony} from '../../../services/telephony.service';

@Component({
    templateUrl: './src/modules/asterisk/templates/asterisktoolbarindicator.html'
})
export class AsteriskToolbarIndicator implements OnDestroy {

    private socket: any;
    private status: string = 'initial';
    private callevent: string = '';
    private extension: string = '';

    private activeCall: any = {
        callnumber: '',
        callevent: '',
        callid: '',
        direction: ''
    };

    constructor(private language: language, private backend: backend, private toast: toast, private dockedComposer: dockedComposer, private telephony: telephony) {
        this.backend.getRequest('asterisk/userext').subscribe(resp => {
            if (resp.extension) {
                this.extension = resp.extension;
                this.connect();
            }
        });
    }

    private connect() {
        this.socket = socketIo('http://asterisk.spicecrm.io:3000?room=' + this.extension);

        this.socket.on('connect', (socket) => {
            this.status = 'connected';
        });

        this.socket.on('disconnect', () => {
            this.status = 'disconnect';
        });

        this.socket.on('message', (data) => {
            this.setCallStatus(data.text);
        });
    }

    public ngOnDestroy() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        }
    }

    get color() {

        let color: string = '';
        switch (this.status) {
            case 'connected':
                color = 'green';
                break;
            case 'disconnect':
                color = 'red';
                break;
            default:
                color = 'grey';
                break;

        }

        return color;
        /*
        return {
            fill: color + '!important'
        };
        */
    }

    private toggleconnect() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        } else {
            this.socket.connect();
        }
    }

    private setCallStatus(message) {
        this.callevent = message.event ? message.event : '';

        this.activeCall.callevent = message.event;
        this.activeCall.callid = message.callId;
        this.activeCall.callnumber = message.outsideNo;
        this.activeCall.direction = message.direction;

        switch (message.event) {
            case 'OUTBOUND':
            case 'RING':
                this.telephony.calls.push(this.activeCall);
                break;
        }
    }

    private simulatecall() {
        /*
        this.activeCall.callevent = 'RING';
        this.activeCall.callid = '66475757';
        this.activeCall.callnumber = '43676898238847';
        this.telephony.calls.push(this.activeCall);
         */
    }
}
