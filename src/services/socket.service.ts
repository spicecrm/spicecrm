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
import {Injectable} from '@angular/core';
import {configurationService} from "../services/configuration.service";
import {broadcast} from "../services/broadcast.service";
import {session} from "../services/session.service";
import {SocketEventI, SocketObjectI} from "./interfaces.service";
import {Observable, of, Subject} from "rxjs";

declare var io: any;
declare var _: any;

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
    /**
     * holds the sockets
     * @private
     */
    private sockets: { [key: string]: SocketObjectI } = {};

    constructor(
        private configuration: configurationService,
        private broadcast: broadcast,
        private session: session
    ) {
    }

    /**
     * returns if the socket is connected
     */
    public socketObject(namespace) {
        return this.sockets[namespace];
    }

    /**
     * returns if we have at least one socket that is connected
     */
    get connected(): boolean {
        return !_.isEmpty(this.sockets);
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
    public initializeNamespace(namespace: string): Observable<SocketEventI> {

        if (!!this.sockets[namespace]) {
            return this.sockets[namespace].event$;
        }

        this.setSocketData();

        if (!this.socketUrl || !this.socketId) {
            return of({type: null, data: null});
        }

        this.sockets[namespace] = this.initializeSocket(namespace);

        return this.sockets[namespace].event$;
    }

    /**
     * emit the room to the serve to join
     * @param namespace
     * @param room
     */
    public joinRoom(namespace: string, room: string) {

        if (!namespace || !room || !this.sockets[namespace]) return;

        if (room in this.sockets[namespace].rooms) {
            this.sockets[namespace].rooms[room]++;
        } else {
            this.sockets[namespace].instance.emit('join:room', room);
            this.sockets[namespace].rooms[room] = 1;
        }
    }

    /**
     * emit the room to the serve to join
     * @param namespace
     * @param room
     */
    public leaveRoom(namespace: string, room: string) {

        if (!namespace || !room || !this.sockets[namespace] || !this.sockets[namespace].rooms[room]) {
            return;
        }

        this.sockets[namespace].rooms[room]--;

        if (this.sockets[namespace].rooms[room] < 1) {
            this.sockets[namespace].instance.emit('leave:room', room);
            delete this.sockets[namespace].rooms[room];
        }
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

        const path = !namespace ? '/' : `/ns-${namespace}`;

        const socket = io(this.socketUrl + path, {
            query: {
                token: this.session.authData.sessionId,
                sysId: this.socketId
            }
        });

        socket.on('connect', () =>
            this.handleConnectEvent(namespace, resSubject)
        );

        socket.onAny((e, res: { token: string, data }) => {
            if (res.token == this.session.authData.sessionId) return;
            this.handleCustomEvent(resSubject, e, res.data);
        });

        return {
            instance: socket,
            isConnected: () => socket.connected,
            event$: resSubject.asObservable(),
            rooms: {}
        };
    }

    /**
     * handle connect event
     * rejoin active rooms
     * @param namespace
     * @param resSubject
     * @private
     */
    private handleConnectEvent(namespace: string, resSubject: Subject<SocketEventI>) {

        if (!this.sockets[namespace]?.rooms) return;

        Object.keys(this.sockets[namespace].rooms)
            .forEach(room => {
                if (this.sockets[namespace].rooms[room] < 1) return;

                this.sockets[namespace].instance.emit('join:room', room);
            });
    }

    /**
     * handle connect event
     * @param resSubject
     * @param event
     * @param data
     * @private
     */
    private handleCustomEvent(resSubject: Subject<SocketEventI>, event: string, data: any) {
        resSubject.next({
            type: event,
            data: data
        });
    }
}
