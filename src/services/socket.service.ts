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
import {EventEmitter, Injectable} from '@angular/core';
import {configurationService} from "../services/configuration.service";
import {broadcast} from "../services/broadcast.service";
import {navigation} from "../services/navigation.service";
import {backend} from "../services/backend.service";
import {modelutilities} from "../services/modelutilities.service";
import {session} from "../services/session.service";
import {Subscription} from "rxjs";

declare var io: any;

@Injectable()
export class socket {

    /**
     * the url for the socket connection from the backend
     */
    private socketurl: string;
    private socketid: string;

    private socket: any;

    private socketconnected: boolean = false;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private configuration: configurationService,
        private broadcast: broadcast,
        private session: session,
        private navigation: navigation,
        private backend: backend,
        private modelutilities: modelutilities
    ) {


        this.broadcast.message$.subscribe(data => {
            if (data.messagetype === 'login') {
                this.initialize();
            }
            if (data.messagetype === 'logout') {
                this.disconnect();
            }
        });
    }

    /**
     * get the prefs and login
     */
    private initialize() {

        if (this.socket) {
            this.socket.disconnect();
            this.socket.destroy();
            this.socket = null;
        }

        // get the scoketurl
        let config = this.configuration.getCapabilityConfig('socket');
        this.socketurl = config.socket_frontend;
        this.socketid = config.socket_id;

        if (this.socketurl && this.socketid) {
            this.connectSocket();
        }
    }

    /**
     * returns if the socket is connected
     */
    get isConnected() {
        return this.socketconnected
    }

    private disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.destroy();
            this.socketurl = undefined;
            this.socketid = undefined;
            this.socket = null;
        }
    }

    /**
     * connect to the socket
     */
    private connectSocket() {
        // ensure we have an URL
        if (!this.socketurl) {
            return false;
        }

        this.socket = io(`${this.socketurl}?sysid=${this.socketid}&room=beanupdates&token=${this.session.authData.sessionId}`);
        this.socket.on('connect', (socket) => {
            this.socketconnected = true;
        });
        this.socket.on('disconnect', () => {
            this.socketconnected = false;
        });
        this.socket.on('message', (data) => {
            this.handleMessage(data);
        });
    }

    /**
     * handle the event from the socket
     * chreck if the session is another óne than the one we are logged in
     * check if the model is active in the model register .. if yes reload it
     * and issue a model saved broadacast message so all views and representations will update accordingy
     *
     * @param eventData
     */
    private handleMessage(eventData: any) {
        switch (eventData.type) {
            case 'error':
                console.log(eventData.message.error);
                break;
            case 'message':
                if (eventData.message.s == this.session.authData.sessionId) {
                    if (this.navigation.modelregister.find(m => m.model.id == eventData.message.i && m.model.module == eventData.message.m)) {
                        this.backend.get(eventData.message.m, eventData.message.i).subscribe(data => {
                            this.broadcast.broadcastMessage("model.save", {
                                id: eventData.message.i,
                                module: eventData.message.m,
                                data: this.modelutilities.backendModel2spice(eventData.message.m, data)
                            });
                        });
                    }
                }
                break;
        }

    }
}
