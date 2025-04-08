/**
 * @module ModuleTelephony
 */
import {Component, ComponentRef} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {telephony} from "../../../services/telephony.service";
import {Subscription} from "rxjs";
import {socket} from "../../../services/socket.service";
import {backend} from "../../../services/backend.service";
import {TelephonyPreferences} from "./telephonypreferences";
import {configurationService} from "../../../services/configuration.service";
import {session} from "../../../services/session.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * a helper component that can be added to the toolbar to manually trigger events for the telephony for testing purposes
 */
@Component({
    selector: 'telephony-toolbar-indicator',
    templateUrl: '../templates/telephonytoolbarindicator.html'
})
export class TelephonyToolbarIndicator {

    /**
     * the status of the connection
     */
    public status: 'initial' | 'connecting' | 'connected' | 'disconnected' = 'initial';
    /**
     * phone number
     */
    public msisdn: string = '';
    /**
     * id of the call
     */
    public callid: string;
    /**
     * rxjs subscriptions to unsubscribe
     */
    public subscriptions = new Subscription();
    /**
     * username
     */
    public username: string;

    /**
     * indicate if we are in testmode
     */
    public testmode: boolean = false;

    constructor(
        public modal: modal,
        public modelutilities: modelutilities,
        public socket: socket,
        public backend: backend,
        public telephony: telephony,
        public session: session,
        public configuration: configurationService
    ) {
        this.callid = this.modelutilities.generateGuid();
        this.connectSocket();

        let telephonyConfig = this.configuration.getCapabilityConfig('telephony');
        if(telephonyConfig.testmode == 1) this.testmode = true;
    }

    /**
     * returns a status dependet icon class
     */
    get iconClass() {
        switch (this.status) {
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

    private _enabled: boolean;

    get enabled() {
        return this._enabled;
    }

    /**
     * toggle connection to the socket
     * @param value
     */
    set enabled(value) {
        this._enabled = value;

        if (!this.enabled) {
            this.connectSocket();
        } else {
            this.disconnect();
        }
    }

    /**
     * toggle connection to socket
     */
    public toggleConnection() {
        this.enabled = !this.enabled;
    }


    /**
     * adds the call
     * @private
     */
    public doAddCall() {
        this.modal.prompt('input', 'msisdn', 'enter the calling number', 'shade', this.msisdn).subscribe(msisdn => {
            this.msisdn = msisdn;
            let calldata = {
                id: this.callid,
                direction: 'inbound',
                callernumber: this.msisdn,
                state: 'INCOMING',
            };
            this.handleCallEvent(calldata);
        });


    }

    /**
     * connects the call
     */
    public doConnectCall() {
        let calldata = {
            id: this.callid,
            direction: 'inbound',
            callernumber: this.msisdn,
            state: 'CONNECTED',
        };
        this.handleCallEvent(calldata);
    }

    /**
     * disconnects the call
     */
    public doDisconnectCall() {
        let calldata = {
            id: this.callid,
            direction: 'inbound',
            callernumber: this.msisdn,
            state: 'HANGUP',
        };
        this.handleCallEvent(calldata);
    }

    /**
     * handle the event from the socket
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
     * @param eventData
     */
    public addCall(eventData) {
        this.telephony.calls.push({
            id: this.modelutilities.generateGuid(),
            callid: eventData.id,
            status: this.translateStatus(eventData.state),
            msisdn: eventData.direction == 'inbound' ? eventData.callernumber : eventData.callednumber,
            direction: eventData.direction,
            start: eventData.state == 'CONNECTED' ? moment() : undefined
        });
    }

    /**
     * map status
     * @param status
     */
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
     * connect to the socket
     */
    public connectSocket() {

        if (!this.username) return;

        this.subscriptions.add(
            this.socket.initializeNamespace('telephonyGeneric').subscribe(event => {
                if (event.data) this.handleCallEvent(event.data);
            })
        );

        // join the room
        this.socket.joinRoom('telephonyGeneric', `telephonyGeneric::${this.session.authData.userId}`);

        if (this.socket.connected) {
            this.status = 'connected';
        }
    }

    /**
     * disconnect from the socket
     */
    public disconnectSocket() {
        if (this.socket) {
            this.socket.leaveRoom('telephonyGeneric', `telephonyGeneric::${this.username}`);
        }
    }

    /**
     * disconnects
     */
    public disconnect() {
        this.status = 'disconnected';
        this.disconnectSocket();
        this.telephony.isActive = false;
        this.subscriptions.unsubscribe();
    }

    /**
     * get the preferences and check if we have a username set
     */
    public setPreferences() {
        this.modal.openModal('TelephonyPreferences').subscribe((modalRef: ComponentRef<TelephonyPreferences>) => {
            modalRef.instance.saved$.subscribe(saved => {
                this.username = modalRef.instance.preferences.username;
                this.connectSocket();
            });
        });
    }
}
