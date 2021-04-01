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
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString) {
            let msisdn = this.calldata.msisdn;
            return libphonenumber.parsePhoneNumberFromString(msisdn, 'AT').formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

}
