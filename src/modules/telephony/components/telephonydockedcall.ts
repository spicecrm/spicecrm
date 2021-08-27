/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {telephony} from '../../../services/telephony.service';
import {telephonyCallI} from "../../../services/interfaces.service";
import {libloader} from "../../../services/libloader.service";

declare var moment: any;
declare var libphonenumber: any;

@Component({
    templateUrl: './src/modules/telephony/templates/telephonydockedcall.html'
})
export class TelephonyDockedCall {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    @Input() public calldata: telephonyCallI;

    private phonelibloaded: boolean = false;

    private isClosed: boolean = false;

    private panelcomponent: string = 'TelephonyCallSearching';

    private matchedbeans: any[] = [];

    private hideEndCallButton: boolean = false;

    constructor(private backend: backend,
                private modal: modal,
                private libloader: libloader,
                private telephony: telephony,
                private language: language,
                private cdref: ChangeDetectorRef,
                private ViewContainerRef: ViewContainerRef,
                private metadata: metadata) {
        this.loadPhoneLib();
    }

    /**
     * loads the phone lib
     */
    private loadPhoneLib() {
        this.libloader.loadLib('libphonenumber').subscribe(loaded => {
            this.phonelibloaded = true;
        });
    }

    get callicon() {
        if (this.calldata.status == 'disconnected') {
            return 'end_call';
        }

        switch (this.calldata.direction) {
            case 'inbound':
                return 'incoming_call';
            case 'outbound':
                return 'outbound_call';
        }

        return 'call';
    }

    public ngOnInit() {
        if (this.calldata.relatedid) {
            this.panelcomponent = 'TelephonyCallPanel';
        } else {
            this.backend.postRequest('search/phonenumber', {}, {
                searchterm: this.calldata.msisdn
            }).subscribe(results => {
                this.matchedbeans = results;
                if (results.length == 1) {
                    this.calldata.relatedmodule = results[0].module;
                    this.calldata.relatedid = results[0].id;
                    this.calldata.relateddata = results[0].data;
                }
                this.panelcomponent = 'TelephonyCallPanel';
            });
        }
        this.getConfiguration();
    }

    private getConfiguration() {
        this.hideEndCallButton = this.metadata.getComponentConfig('TelephonyCallPanel')?.hideEndCallButton;
    }

    /**
     * close the composer and remove the call
     */
    private closeComposer() {
        if (this.calldata.note && !this.calldata.call) {
            this.modal.prompt('confirm', this.language.getLabel('MSG_CLOSE_CALL_COMPOSER', '', 'long'), this.language.getLabel('MSG_CLOSE_CALL_COMPOSER')).subscribe(resp => {
                if (resp) {
                    this.telephony.removeCallById(this.calldata.id);
                }
            });
        } else {
            this.telephony.removeCallById(this.calldata.id);
        }
    }

    /**
     * end the call
     */
    private endCall() {
        this.telephony.terminateCall(this.calldata.id);
    }

    /**
     * toggles the closed state for the composer
     */
    private toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    /**
     * returns the toggle icon for the docked composer
     */
    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }

    /**
     * returns true if the call can be ended by the user
     */
    get canEndCall() {
        return this.calldata.callid && this.calldata.status != 'disconnected' && this.calldata.status != 'error';
    }


    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString && this.calldata.msisdn.length > 5) {
            let msisdn = this.calldata.msisdn;
            return libphonenumber.parsePhoneNumberFromString(msisdn, 'AT').formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

}
