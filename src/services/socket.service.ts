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

        // todo move to the module where it is used
        this.broadcast.message$.subscribe(data => {
            if (data.messagetype === 'login') {
                this.initialize('');
            }
            if (data.messagetype === 'logout') {
                this.disconnect();
            }
        });
    }

    /**
     * get the prefs and login
     */
    private initialize(room) {

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
            this.connectSocket(room);
        }
    }

    /**
     * returns if the socket is connected
     */
    get isConnected() {
        return this.socketconnected;
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
    private connectSocket(room) {
        // ensure we have an URL
        if (!this.socketurl) {
            return false;
        }

        this.socket = io(`${this.socketurl}?sysid=${this.socketid}&room=${room}&token=${this.session.authData.sessionId}`);
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
                if (eventData.message.s != this.session.authData.sessionId) {
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
