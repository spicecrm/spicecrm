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
 * @module ObjectFields
 */
import {Component, EventEmitter, Input, NgZone, Output} from '@angular/core';

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: './src/objectfields/templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress {
    /*
    * emit after typing
    */
    @Output() public onBlur = new EventEmitter<void>();
    /*
    * @input email address data
    */
    @Input() private emailAddress: any = {};
    /**
     * holds the typing timeout
     * @private
     */
    private typingTimeout: number;

    constructor(private zone: NgZone) {
    }

    /**
     * @return the email address string
     */
    get emailAddressText() {
        return this.emailAddress.email_address;
    }

    /**
     * set the email address string
     * @param value
     */
    set emailAddressText(value) {

        this.emailAddress.email_address = value;
        this.emailAddress.email_address_caps = value.toUpperCase();

        this.zone.runOutsideAngular(() => {
            window.clearTimeout(this.typingTimeout);
            this.typingTimeout = window.setTimeout(() =>
                    this.zone.run(() => {
                        this.validateEmailAddress();
                        this.onBlur.emit();
                    })
                ,
                500
            );
        });
    }

    /**
     * validate the email address by regex
     * @private
     */
    private validateEmailAddress() {
        const validation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
        this.emailAddress.invalid_email = validation.test(this.emailAddress.email_address) ? 0 : 1;
    }
}
