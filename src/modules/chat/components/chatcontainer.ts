/**
 * @module ModuleChat
 */
import {Component, OnDestroy} from '@angular/core';


import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

declare var socketIo: any;

@Component({
    templateUrl: '../templates/chatcontainer.html'
})
export class ChatContainer implements OnDestroy {

    public socket: any;
    public status: string = 'initial';
    public message: string = '';
    public messages: string[] = [];

    constructor(public language: language, public model: model, public backend: backend, public toast: toast) {
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

    public toggleconnect() {
        if (this.status == 'connected') {
            this.socket.disconnect();
        } else {
            this.socket.connect();
        }
    }

    public send() {
        this.socket.emit('message', {room: this.model.id, message: this.message}, (ack) => {
            console.log(ack);
        });
    }

    public addMessage(message) {
        let messageString = message.callId + ' ' + message.event + ' ' + message.relatedData;
        this.messages.push(messageString);
    }
}
