/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {configurationService} from "../services/configuration.service";
import {broadcast} from "../services/broadcast.service";
import {navigation} from "../services/navigation.service";
import {backend} from "../services/backend.service";
import {modelutilities} from "../services/modelutilities.service";
import {session} from "../services/session.service";
import {SocketEventDataI, SocketEventI, SocketObjectI} from "./interfaces.service";
import {Subject} from "rxjs";

declare var io: any;

@Injectable()
export class socket {

    /**
     * the url for the socket connection from the backend
     */
    private socketUrl: string;
    /**
     * holds the socket id from the backend
     * @private
     */
    private socketId: string;

    private sockets: { [key: string]: SocketObjectI } = {};

    constructor(
        private configuration: configurationService,
        private broadcast: broadcast,
        private session: session,
        private navigation: navigation,
        private backend: backend,
        private modelutilities: modelutilities
    ) {
    }

    /**
     * returns if the socket is connected
     */
    public socketObject(namespace) {
        return this.sockets[namespace];
    }

    /**
     * disconnect the socket and reset the socket variables
     */
    public disconnect(namespace: string) {
        if (this.sockets[namespace]) {
            this.sockets[namespace].instance.disconnect();
            this.sockets[namespace].instance.destroy();
            delete this.sockets[namespace];
        }
    }

    /**
     * initialize a new socket instance with namespace and register an event listener
     * @param namespace
     */
    public initializeNamespace(namespace: string): SocketObjectI {

        if (!!this.sockets[namespace]) {
            return this.sockets[namespace];
        }

        this.setSocketData();

        if (!this.socketUrl || !this.socketId) {
            return;
        }

        return this.sockets[namespace] = this.initializeSocket(namespace);
    }

    /**
     * emit the room to the serve to join
     * @param namespace
     * @param room
     */
    public joinRoom(namespace: string, room: string) {
        if (!namespace || !room) return;
        this.sockets[namespace].instance.emit('join:room', room);
    }

    /**
     * emit the room to the serve to join
     * @param namespace
     * @param room
     */
    public leaveRoom(namespace: string, room: string) {
        if (!namespace || !room) return;
        this.sockets[namespace].instance.emit('leave:room', room);
    }

    /**
     * load socket config from spice config
     * @private
     */
    private setSocketData() {
        let config = this.configuration.getCapabilityConfig('socket');
        this.socketUrl = config.socket_frontend;
        this.socketId = config.socket_id;
    }

    /**
     * initialize a socket connection and register an event handler
     * @param namespace
     * @private
     */
    private initializeSocket(namespace: string): SocketObjectI {

        const resSubject = new Subject<SocketEventI>();

        namespace = !namespace ? '/' : `/ns-${namespace}`;

        const socket = io(this.socketUrl + namespace, {
            query: {
                token: this.session.authData.sessionId,
                sysid: this.socketId,
                namespace: namespace,
                userid: this.session.authData.userId
            }
        });

        socket.on('connect', () => this.handleConnectEvent(resSubject));

        socket.on('disconnect', () => this.handleDisconnectEvent(resSubject));

        socket.onAny((e, data) => {
            this.handleCustomEvent(resSubject,e, data);
        });

        return {instance: socket, isConnected: socket.connected, event$: resSubject.asObservable()};
    }

    /**
     * handle connect event
     * @param resSubject
     * @private
     */
    private handleConnectEvent(resSubject: Subject<SocketEventI>) {
        window.console.log('socket connected');
    }

    /**
     * handle connect event
     * @param resSubject
     * @private
     */
    private handleDisconnectEvent(resSubject: Subject<SocketEventI>) {
        resSubject.complete();
        window.console.log('socket disconnected');
    }

    /**
     * handle connect event
     * @param resSubject
     * @param event
     * @param data
     * @private
     */
    private handleCustomEvent(resSubject: Subject<SocketEventI>,event: string, data: any) {
        resSubject.next({
            type: event,
            data: data
        });
    }

    /**
     * handle the event from the socket
     * check if the session is another óne than the one we are logged in
     * check if the model is active in the model register .. if yes reload it
     * and issue a model saved broadcast message so all views and representations will update accordingly
     *
     * @param eventData
     */
    private handleMessage(eventData: SocketEventDataI) {
        switch (eventData.type) {
            case 'error':
                console.error(eventData.message.error);
                break;
            case 'message':
                if (eventData.message.sessionId == this.session.authData.sessionId) {
                    if (this.navigation.modelregister.find(m => m.model.id == eventData.message.id && m.model.module == eventData.message.module)) {
                        this.backend.get(eventData.message.module, eventData.message.id).subscribe(data => {
                            this.broadcast.broadcastMessage("model.save", {
                                id: eventData.message.id,
                                module: eventData.message.module,
                                data: this.modelutilities.backendModel2spice(eventData.message.module, data)
                            });
                        });
                    }
                }
                break;
        }
    }
}
