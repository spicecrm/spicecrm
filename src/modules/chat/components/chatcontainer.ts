import {Component, Input, HostBinding, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import * as socketIo from 'socket.io-client';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {popup} from '../../../services/popup.service';
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: './src/modules/chat/templates/chatcontainer.html'
})
export class ChatContainer implements OnDestroy {

    private socket: any;
    private status: string = 'initial';
    private message: string = '';
    private messages: string[] = [];

    constructor(private language: language, private model: model, private backend: backend, private toast: toast) {
        this.socket = socketIo('http://localhost:3000?room=' + this.model.id);

        this.socket.on('connect', (socket) => {
            this.status = 'connected';
        });

        this.socket.on('disconnect', () => {
            this.status = 'disconnect';
        });

        this.socket.on('message', (data) => {
            console.log(data);
            this.addMessage(data.text);
        });
    }

    public ngOnDestroy() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        }
    }

    private toggleconnect() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        } else {
            this.socket.connect();
        }
    }

    private send() {
        this.socket.emit('message', {room: this.model.id, message: this.message}, (ack) => {
            console.log(ack);
        });
    }

    private addMessage(message) {
        this.messages.push(message);
    }
}
