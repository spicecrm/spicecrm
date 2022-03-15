/**
 * @module ModuleFive9
 */
import {Component, OnDestroy} from '@angular/core';

/**
 * @ignore
 */
declare var io: any;
// declare var libphonenumber: any;

import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";
import {session} from "../../../services/session.service";

import {telephonyCallI} from "../../../services/interfaces.service";

declare var moment: any;

/**
 * renders an indicator on the global toolbar that links to the five9 VOIP System
 */
@Component({
    templateUrl: '../templates/five9toolbarindicator.html'
})
export class Five9ToolbarIndicator implements OnDestroy {

    public socket: any;

    public username: string;

    /**
     * the status of the connection
     */
    public five9status: 'initial' | 'connecting' | 'connected' | 'disconnected' = 'initial';

    /**
     * the url for the socket connection from the backend
     */
    public socketurl: string;

    /**
     * a unique id for the server to connect to the socket
     */
    public socketid: string;

    /**
     * the socket status
     */
    public socketconnected: boolean = false;

    /**
     * holds the subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    public _enabled: boolean = true;

    constructor(
        public language: language,
        public configuration: configurationService,
        public modal: modal,
        public modelutilities: modelutilities,
        public backend: backend,
        public toast: toast,
        public session: session,
        public telephony: telephony
    ) {
        this.initialize();
    }


    public ngOnDestroy() {
        if (this.five9status == 'connected') {
            this.socket.disconnect();
        }
        this.subscriptions.unsubscribe();

        // desctroy the socket
        this.disconnectSocket();

        this.telephony.isActive = false;
    }

    /**
     * returns a status dependet icon class
     */
    get iconClass() {
        switch (this.five9status) {
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

    public toggleconnection() {
        this.enabled = !this.enabled;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;

        if (this.enabled) {
            this.login();
        } else {
            this.disconnect();
        }
    }

    /**
     * get the prefs and login
     */
    public initialize() {

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
    public getPreferences(): Observable<string> {
        let retSubject = new Subject<string>();
        this.backend.getRequest('channels/voice/Five9/preferences').subscribe(prefs => {
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
    public setPreferences() {
        this.modal.openModal('Five9Preferences').subscribe(componentRef => {
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
    public login() {
        // unsubscribe from all subscriptions
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();

        // set status to connecting
        this.five9status = "connecting";
        this.backend.postRequest('channels/voice/Five9/login').subscribe(res => {
            if (res.login) {
                this.five9status = "connected";
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

            }
        });
    }

    /**
     * disconnects
     */
    public disconnect() {
        this.five9status = 'disconnected';

        this.disconnectSocket();
        this.telephony.isActive = false;
        this.subscriptions.unsubscribe();
    }

    /**
     * connect to the socket
     */
    public connectSocket() {
        // ensure we have an URL
        if (!this.socketurl) {
            return false;
        }

        this.socket = io(`${this.socketurl}?sysid=${this.socketid}&room=${this.username}&token=${this.session.authData.sessionId}`);
        this.socket.on('connect', (socket) => {
            this.socketconnected = true;
        });
        this.socket.on('disconnect', () => {
            this.socketconnected = false;
        });
        this.socket.on('message', (data) => {
            this.handleCallEvent(data.message);
        });

    }

    /**
     * disconnect from the socket
     */
    public disconnectSocket() {
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
    public handleCallEvent(eventData: any) {
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
    public addCall(eventData) {
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

    public translateStatus(status) {
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
    public initiateCall(msisdn: string, relatedmodule?: string, relatedid?: string, relateddata?: any) {

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
        this.backend.postRequest('channels/voice/Five9/call', {}, {msisdn: msisdn}).subscribe(call => {
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
    public terminateCall(call: telephonyCallI) {
        if (call.callid) {
            this.backend.deleteRequest(`channels/voice/Five9/call/${call.callid}`).subscribe(deleted => {
                call.status = 'disconnected';
            });
        }
    }


}
