import {Component, Input, HostBinding, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import * as socketIo from 'socket.io-client';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {popup} from '../../../services/popup.service';
import {backend} from "../../../services/backend.service";
import {dockedComposer} from '../../../services/dockedcomposer.service';

@Component({
    templateUrl: './src/modules/asterisk/templates/asterisktoolbarindicator.html'
})
export class AsteriskToolbarIndicator implements OnDestroy {

    private socket: any;
    private status: string = 'initial';
    private callevent: string = '';
    private message: string = '';
    private messages: string[] = [];
    private extension: string = '';

    private activeCall: any = {
        callnumber: '',
        callevent: '',
        callid: '',
        direction: ''
    };

    constructor(private language: language, private backend: backend, private toast: toast, private dockedComposer: dockedComposer) {
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
                this.dockedComposer.calls.push(this.activeCall);
                break;
        }
    }

    private simulatecall() {
        this.activeCall.callevent = 'RING';
        this.activeCall.callid = '66475757';
        this.activeCall.callnumber = '43676898238847';
        this.dockedComposer.calls.push(this.activeCall);
    }
}
