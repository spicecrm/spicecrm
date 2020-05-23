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

declare var io: any;

@Injectable()
export class socket {

    /**
     * the url for the socket connection from the backend
     */
    private socketurl: string;

    private socket: any;

    private socketconnected: boolean = false;

    public modelupdate$: EventEmitter<any> = new EventEmitter<any>();

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
        this.socketurl = this.configuration.data.socket_frontend;
        if (this.socketurl) {
            this.connectSocket();
        }
    }

    private disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.destroy();
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

        this.socket = io(`${this.socketurl}?room=beanupdates`);
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
        if (eventData.message.s != this.session.authData.sessionId) {
            console.log(eventData);
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
    }
}
