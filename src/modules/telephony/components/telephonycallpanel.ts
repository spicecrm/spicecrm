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

    @Input() public calldata: telephonyCallI;

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

}
