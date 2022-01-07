/**
 * @module ModuleTelephony
 */
import {Component, OnDestroy} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {telephony} from "../../../services/telephony.service";

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
export class TelephonyToolbarIndicator  {

    public msisdn: string = '';

    public callid: string;

    constructor(
        public modal: modal,
        public modelutilities: modelutilities,
        public telephony: telephony
    ) {
        this.callid = this.modelutilities.generateGuid();
    }


    /**
     * adds the call
     *
     * @private
     */
    public doAddCall() {
        this.modal.prompt('input', 'msisdn', 'enter the calling number', 'shade', this.msisdn).subscribe(msisdn => {
            this.msisdn= msisdn;
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
     *
     * @private
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
     *
     * @private
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


}
