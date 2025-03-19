/**
 * @module ModuleCisco
 */
import {Component, OnDestroy} from '@angular/core';

/**
 * @ignore
 */
declare var io: any;

import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";
import {session} from "../../../services/session.service";
import {socket} from "../../../services/socket.service";
import {metadata} from "../../../services/metadata.service";

import {telephonyCallI} from "../../../services/interfaces.service";
import {userpreferences} from "../../../services/userpreferences.service";

declare var moment: any;

@Component({
    templateUrl: '../templates/ciscotoolbarindicator.html'
})
export class CiscoToolbarIndicator implements OnDestroy {


    public username: string;
    public phone_extension: string;

    /**
     * the status of the connection
     */
    public ciscostatus: 'initial' | 'connecting' | 'connected' | 'disconnected' = 'initial';


    /**
     * the socket status
     */
    public socketconnected: boolean = false;

    /**
     * holds the subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * an interval function to keep the login alive
     */
    public keepAlive: any;

    /**
     * allows to track if we are ina  keep alive loop currently
     *
     * @private
     */
    public inKeepAlive: boolean = false;

    /**
     * indicator if the subscriptions for the events are active
     */
    public ciscosubscription: boolean = false;

    public _enabled: boolean = true;
    public _canAccess: boolean = false;

    constructor(
        public language: language,
        public configuration: configurationService,
        public modal: modal,
        public modelutilities: modelutilities,
        public backend: backend,
        public toast: toast,
        public session: session,
        public socket: socket,
        public telephony: telephony,
        public metadata: metadata,
        public userpreferences: userpreferences
    ) {
        this.checkAccess();
        this.initialize();
    }


    public ngOnDestroy() {
        if (this.ciscostatus == 'connected') {
            this.disconnectSocket();
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
        switch (this.ciscostatus) {
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
        if (this.enabled) {
            this.login();
        }
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

    get canAccess() {
        return this._canAccess;
    }

    /**
     * get the prefs and login
     */
    public initialize() {
        this.phone_extension = this.userpreferences.getPreference('phone_extension');
        this.username = this.session.authData.userName;
        if (this._canAccess) {
            this.login();
        }
    }

    /**
     * get the preferences and check if we have a username set
     */
    public getPreferences(): Observable<string> {
        let retSubject = new Subject<string>();
        this.username = this.session.authData.userName;
        this.phone_extension = this.userpreferences.getPreference('phone_extension');
        retSubject.next(this.username);
        retSubject.complete();
        return retSubject.asObservable();
    }

    /**
     * login to the UC
     */
    public login() {
        // unsubscribe from all subscriptions
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();

        // set status to connecting
        this.ciscostatus = "connecting";
        if (this.phone_extension) {
            this.ciscostatus = "connected";
            this.telephony.isActive = true;
            this._enabled = true;

            this.keepAlive = setInterval(() => {
                this.keepalive();
            }, 45000);

            // set the subscription status
            this.ciscosubscription = true;

            // if we have a subscription also connect to the socket
            if (this.ciscosubscription) {
                this.connectSocket();
            }
        }
    }

    /**
     * disconnects
     */
    public disconnect() {
        this.ciscostatus = 'disconnected';
        this.ciscosubscription = false;
        if (this.keepAlive) {
            clearInterval(this.keepAlive);
            this.keepAlive = undefined;
        }
        this.disconnectSocket();
        this.telephony.isActive = false;
        this.subscriptions.unsubscribe();
    }

    /**
     * cisco needs a timed ping to keep the session
     *
     * @private
     */
    public keepalive() {
        if(this.inKeepAlive) return;

        this.inKeepAlive = true;
        this.ciscostatus = 'disconnected';
        clearInterval(this.keepAlive);
        this.login();

        // reset the inidicator
        this.inKeepAlive = false;
    }

    /**
     * connect to the socket
     */
    public connectSocket() {

        this.subscriptions.add(
            this.socket.initializeNamespace('ciscocalls').subscribe(event => {
                if(event.data) this.handleCallEvent(event.data);
            })
        );

        // join the room
        // ToDo: ensure that the joining the room is authorized
        this.socket.joinRoom('ciscocalls', `ciscocalls::${this.username}`);

        // set to socket connected
        this.socketconnected = true;

    }

    /**
     * disconnect from the socket
     */
    public disconnectSocket() {
        if (this.socket) {
            this.socket.leaveRoom('ciscocalls', `ciscocalls::${this.username}`);
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
    }

    /**
     * terminate the call
     *
     * @param call
     */
    public terminateCall(call: telephonyCallI) {
        if (call.callid) {
            call.status = 'disconnected';
        }
    }

    public checkAccess() {
        this._canAccess = this.metadata.checkModuleAcl('Calls', 'ciscocall');
    }

}
