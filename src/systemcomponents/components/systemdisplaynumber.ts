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
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {currency} from '../../services/currency.service';

/**
 * displays a number formatted as number and if a currency id is passed in with the currwency symbol
 */
@Component({
    selector: 'system-display-number',
    templateUrl: './src/systemcomponents/templates/systemdisplaynumber.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayNumber implements OnChanges {

    /**
     * the number to be displayed
     */
    @Input() private number: any;

    /**
     * the field
     */
    @Input() private currency_id: string;

    /**
     * set thisto ture so no values past the comma sre displayed
     *
     * @private
     */
    @Input() private noDigits: boolean = false;


    constructor(private language: language, private cdRef: ChangeDetectorRef, private currency: currency, private userpreferences: userpreferences) {

    }

    /**
     * helper to get the currency symbol
     */
    get currencySymbol(): string {
        if (!this.currency_id) return '';

        let matchedCurrency = this.currency.getCurrencies().find(currency => currency.id == this.currency_id);
        return matchedCurrency ? matchedCurrency.symbol : '';
    }

    /**
     * gets the fornmatted value
     */
    get value() {
        if ((this.number && this.number != '') || this.number === 0) {

            // check if thsi is a string and tehn try to parse to float
            if(typeof(this.number) == "string") this.number = parseFloat(this.number);

            return this.noDigits ?  this.userpreferences.formatMoney(this.number, 0) : this.userpreferences.formatMoney(this.number);
        }
    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    private detectChanges() {
        this.cdRef.detectChanges();
    }

}
