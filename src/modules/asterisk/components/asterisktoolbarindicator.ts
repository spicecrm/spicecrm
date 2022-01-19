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
    templateUrl: '../templates/asterisktoolbarindicator.html'
})
export class AsteriskToolbarIndicator implements OnDestroy {

    public socket: any;
    public status: string = 'initial';
    public callevent: string = '';
    public extension: string = '';

    public activeCall: any = {
        callnumber: '',
        callevent: '',
        callid: '',
        direction: ''
    };

    constructor(public language: language, public backend: backend, public toast: toast, public dockedComposer: dockedComposer, public telephony: telephony) {
        this.backend.getRequest('asterisk/userext').subscribe(resp => {
            if (resp.extension) {
                this.extension = resp.extension;
                this.connect();
            }
        });
    }

    public connect() {
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

    public toggleconnect() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        } else {
            this.socket.connect();
        }
    }

    public setCallStatus(message) {
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

    public simulatecall() {
        /*
        this.activeCall.callevent = 'RING';
        this.activeCall.callid = '66475757';
        this.activeCall.callnumber = '43676898238847';
        this.telephony.calls.push(this.activeCall);
         */
    }
}
