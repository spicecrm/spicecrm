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
