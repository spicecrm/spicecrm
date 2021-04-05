/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: './src/objectfields/templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress {
    /*
    * @output primaryaddress: EventEmitter: boolean
    */
    @Output() public primaryaddress: EventEmitter<boolean> = new EventEmitter<boolean>();
    /*
    * @output onBlur: EventEmitter: boolean
    */
    @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('inputText', {static: false}) private inputText: ElementRef;
    /*
    * @input emailaddress: object
    */
    @Input() private emailaddress: any = {};
    /**
     * holds the input radio unique name for the primary radio button
     */
    @Input() public primaryInputRadioName: string;

    constructor(public language: language) {

    }

    /*
    * @return emailadr: string
    */
    get emailadr() {
        return this.emailaddress.email_address;
    }

    /*
    * @param emailaddress: string
    * @set email_address: string
    * @set email_address_caps: string
    */
    set emailadr(emailaddress) {
        this.emailaddress.email_address = emailaddress;
        this.emailaddress.email_address_caps = emailaddress.toUpperCase();
    }

    /*
    * @return primary_address: '1' | '0'
    */
    get primary() {
        return this.emailaddress.primary_address;
    }

    /*
    * @param value: string
    * @set primary_address
    * @emit boolean by primaryaddress
    * @emit void by onBlur
    */
    set primary(value) {
        if (this.emailaddress.invalid_email != 1 && this.emailaddress.email_address != '') {
            this.emailaddress.primary_address = '1';
            this.primaryaddress.emit(true);
        }
        this.onBlur.emit();
    }

    /*
    * @return opt_out: boolean
    */
    get opt_out() {
        return this.emailaddress.opt_out == 1;
    }

    /*
    * @set opt_out: 1 | 0
    */
    set opt_out(value) {
        if (this.emailaddress.invalid_email != 1) {
            this.emailaddress.opt_out = value ? 1 : 0;
        }
    }

    /*
    * @return invalid_email: boolean
    */
    get invalid_email() {
        return this.emailaddress.invalid_email == 1;
    }
}
