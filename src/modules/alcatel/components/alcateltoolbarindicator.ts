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
declare var io: any;
declare var moment: any;

// declare var libphonenumber: any;

import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {session} from '../../../services/session.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";
import {telephonyCallI} from "../../../services/interfaces.service";


@Component({
    templateUrl: './src/modules/alcatel/templates/alcateltoolbarindicator.html'
})
export class AlcatelToolbarIndicator implements OnDestroy {

    private socket: any;
    private status_socket: any;

    private username: string;

    /**
     * the status of the connection
     */
    private alcatelstatus: 'initial' | 'connecting' | 'connected' | 'disconnected' = 'initial';

    /**
     * the url for the socket connection from the backend
     */
    private socketurl: string;

    /**
     * a unique id for the server to connect to the socket
     */
    private socketid: string;

    /**
     * the socket status
     */
    private socketconnected: boolean = false;

    /**
     * holds the subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * an interval function to keep the login alive
     */
    private keepAlive: any;

    /**
     * indicator if the subscriptions for the events are active
     */
    private alcatelsubscription: boolean = false;

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private language: language,
        private modal: modal,
        private modelutilities: modelutilities,
        private telephony: telephony,
        private toast: toast,
        private session: session
    ) {
        this.initialize();
    }


    public ngOnDestroy() {
        if (this.alcatelstatus == 'connected') {
            this.socket.disconnect();
        }
        this.subscriptions.unsubscribe();

        // stop the keep alive ping
        if (this.keepAlive) clearInterval(this.keepAlive);

        // desctroy the socket
        this.disconnectSocket();

        this.telephony.isActive = false;
    }

    /**
     * returns a status dependet icon class
     */
    get iconClass() {
        switch (this.alcatelstatus) {
            case 'connecting':
                return 'slds-icon-text-warning';
            case 'connected':
                return 'slds-icon-text-success';
            case 'disconnected':
                return 'slds-icon-text-error';
            default:
                return 'slds-icon-text-light';
        }
    }

    /**
     * get the prefs and login
     */
    private initialize() {

        // get the scoketurl

        let config = this.configuration.getCapabilityConfig('socket');
        this.socketurl = config.socket_frontend;
        this.socketid = config.socket_id;

        this.getPreferences().subscribe(username => {
            this.login();
        });
    }

    /**
     * get the preferences and check if we have a username set
     */
    private getPreferences(): Observable<string> {
        let retSubject = new Subject<string>();
        this.backend.getRequest('alcatel/preferences').subscribe(prefs => {
            if (prefs.username) {
                this.username = prefs.username;
                retSubject.next(this.username);
            }
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    /**
     * get the preferences and check if we have a username set
     */
    private setPreferences() {
        this.modal.openModal('AlcatelPreferences').subscribe(componentRef => {
            componentRef.instance.saved$.subscribe(saved => {
                this.getPreferences().subscribe(username => {
                    this.login();
                });
            });
        });
    }

    /**
     * login to the UC
     */
    private login() {
        this.alcatelstatus = "connecting";
        this.backend.postRequest('alcatel/login').subscribe(res => {
            if (res.login) {
                this.alcatelstatus = "connected";
                this.telephony.isActive = true;

                // subscribe to the termination of the call
                this.subscriptions.add(
                    this.telephony.initiateCall$.subscribe(calldata => {
                        this.initiateCall(calldata.msisdn, calldata.relatedmodule, calldata.relatedid, calldata.relateddata);
                    })
                );

                // subscribe to the termination of the call
                this.subscriptions.add(
                    this.telephony.terminateCall$.subscribe((call: telephonyCallI) => {
                        this.terminateCall(call);
                    })
                );

                // if we have a subscription also connect to the socket
                this.connectSocket();
            }
        });
    }

    /**
     * disconnects
     */
    private disconnect() {
        this.alcatelstatus = 'disconnected';
        this.alcatelsubscription = false;
        if (this.keepAlive) {
            clearInterval(this.keepAlive);
            this.keepAlive = undefined;
        }
        this.disconnectSocket();
        this.telephony.isActive = false;
    }

    /**
     * connect to the socket
     */
    private connectSocket() {
        // ensure we have an URL
        if (!this.socketurl) {
            return false;
        }

        this.socket = io(`${this.socketurl}?sysid=${this.socketid}&room=alcatel${this.session.authData.sessionId}&token=${this.session.authData.sessionId}`);
        this.socket.on('connect', (socket) => {
            this.socketconnected = true;
        });
        this.socket.on('disconnect', () => {
            this.socketconnected = false;
        });
        this.socket.on('message', (data) => {
            this.handleCallEvent(data.message);
        });

        this.status_socket = io(`${this.socketurl}?sysid=${this.socketid}&room=alcatel&token=${this.session.authData.sessionId}`);
        this.status_socket.on('restart', () => {
            this.login();
        });

    }

    /**
     * disconnect from the socket
     */
    private disconnectSocket() {
        if (this.socket) {
            this.socket.destroy();
            this.socket = undefined;
            this.socketconnected = false;
        }
    }

    /**
     * handle the event from the socket
     *
     * @param eventData
     */
    private handleCallEvent(eventData: any) {
        let call = this.telephony.calls.find(c => c.callid == eventData.id);
        if (call) {
            call.status = this.translateStatus(eventData.state);
            // in case we get to connetced set start
            if (eventData.state == 'CONNECTED' && !call.start) {
                call.start = moment();
            }

            // in case we get a hangup log the end date
            if (eventData.state == 'HANGUP' && !call.end) {
                call.end = moment();
            }
        } else {
            this.addCall(eventData);
        }
    }

    /**
     * adds the call to the telephony service
     *
     * @param eventData
     */
    private addCall(eventData) {
        /*
        let util = libphonenumber.PhoneNumberUtil.getInstance();
        let msisdn = eventData.direction == 'inbound' ? eventData.callernumber : eventData.callednumber;
        let number = util.parseAndKeepRawInput(msisdn);
         */
        this.telephony.calls.push({
            id: this.modelutilities.generateGuid(),
            callid: eventData.id,
            status: this.translateStatus(eventData.state),
            msisdn: eventData.direction == 'inbound' ? eventData.callernumber : eventData.callednumber,
            direction: eventData.direction
        });
    }

    private translateStatus(status) {
        switch (status) {
            case 'PROCEEDING':
                return 'initial';
            case 'RINGBACK':
                return 'connecting';
            case 'INCOMING':
                return 'connecting';
            case 'RINGING':
                return 'ringing';
            case 'CONNECTED':
                return 'connected';
            case 'HANGUP':
                return 'disconnected';
        }
    }

    /**
     * iniitate a call
     *
     * @param msisdn
     * @param relatedmodule
     * @param relatedrecord
     */
    private initiateCall(msisdn: string, relatedmodule?: string, relatedid?: string, relateddata?: any) {

        // create a call and push to the telphony service
        let callid = this.modelutilities.generateGuid();
        let call: telephonyCallI = {
            id: callid,
            status: 'initial',
            callid: undefined,
            msisdn: msisdn,
            direction: 'outbound',
            relatedid: relatedid,
            relatedmodule: relatedmodule,
            relateddata: relateddata
        };
        this.telephony.calls.push(call);

        // initiate the call on teh PBX
        this.backend.postRequest('alcatel/call', {}, {msisdn: msisdn}).subscribe(call => {
            if (call.status != 'success') {
                this.toast.sendToast('error placing call', 'error');
                this.telephony.removeCallById(callid);
            } else {
                let tcall = this.telephony.calls.find(c => c.id == callid);
                tcall.callid = call.callid;
            }
        });
    }

    /**
     * terminate the call
     *
     * @param call
     */
    private terminateCall(call: telephonyCallI) {
        if (call.callid) {
            this.backend.deleteRequest(`alcatel/call/${call.callid}`).subscribe(deleted => {
                call.status = 'disconnected';
            });
        }
    }

    /* automatically done on teh backend
    private subscribe() {
        this.backend.postRequest('StarFaceVOIP/events').subscribe(res => {
            if (res.status == 'success') {
                this.starfacesubscription = true;
            }
        });
    }

    private unsubscribe() {
        this.backend.deleteRequest('StarFaceVOIP/events').subscribe(res => {
            if (res.status == 'success') {
                this.starfacesubscription = false;
            }
        });
    }
    */

}
