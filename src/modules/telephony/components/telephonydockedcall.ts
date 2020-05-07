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
import {backend} from '../../../services/backend.service';
import {telephony} from '../../../services/telephony.service';
import {telephonyCallI} from "../../../services/interfaces.service";

declare var moment: any;

@Component({
    templateUrl: './src/modules/telephony/templates/telephonydockedcall.html'
})
export class TelephonyDockedCall {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    @Input() public calldata: telephonyCallI;

    private isClosed: boolean = false;

    private panelcomponent: string = 'TelephonyCallSearching';

    constructor(private backend: backend, private telephony: telephony, private language: language, private cdref: ChangeDetectorRef, private ViewContainerRef: ViewContainerRef) {

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
                if (results.length == 1) {
                    this.calldata.relatedmodule = results[0].module;
                    this.calldata.relatedid = results[0].id;
                    this.calldata.relateddata = results[0].data;

                    this.panelcomponent = 'TelephonyCallPanel';
                }
            });
        }
    }

    /**
     * close the composer and remove the call
     */
    private closeComposer() {
        this.telephony.removeCallById(this.calldata.id);
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
}
