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
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';

import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";

import {telephonyCallI} from "../../../services/interfaces.service";

declare var _: any;
declare var libphonenumber: any;

@Component({
    templateUrl: './src/modules/telephony/templates/telephonycallpanel.html',
    providers: [model]
})
export class TelephonyCallPanel implements OnInit {

    /**
     * the calldata
     */
    @Input() public calldata: telephonyCallI;

    /**
     * an array of matche records returned fromt eh phone number search
     */
    @Input() public matchedbeans: any[];

    /**
     * notes on the call
     */
    private callnotes: string = '';

    constructor(private language: language, private model: model) {

    }

    public ngOnInit(): void {
        if (this.calldata.relatedid) {
            this.model.id = this.calldata.relatedid;
            this.model.module = this.calldata.relatedmodule;
            this.model.data = this.model.utils.backendModel2spice(this.model.module, this.calldata.relateddata);
        }
    }

    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber.parsePhoneNumberFromString) {
            return libphonenumber.parsePhoneNumberFromString(this.calldata.msisdn, 'AT').formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

    /**
     * select the match
     *
     * @param record
     */
    private selectMatched(record) {
        this.model.id = record.id;
        this.model.module = record.module;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, record.data);

        this.calldata.relatedid = record.id;
        this.calldata.relatedmodule = record.module;
        this.calldata.relateddata = record.data;
    }

    /**
     * no match found in the listed items
     */
    private noMatch() {
        this.matchedbeans = [];
    }

}
