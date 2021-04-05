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
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with currency
 */
@Component({
    selector: 'reporter-field-currency',
    templateUrl: './src/modules/reports/templates/reporterfieldcurrency.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldCurrency implements OnInit {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: string = '';
    /**
     * display currency symbol
     */
    private currencySymbol: string = '';

    constructor(private currency: currency, private userpreferences: userpreferences) {

    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setCurrencySymbol();
        this.setFormattedFieldValue();
    }

    /**
     * set currency symbol
     */
    private setCurrencySymbol() {

        if (!this.record[this.field.fieldid]) return;

        let currencyId = -99;

        const fieldCurrencyId = this.field.fieldid + '_curid';
        const currencies = this.currency.getCurrencies() || [];

        if (fieldCurrencyId) {
            currencyId = this.record[fieldCurrencyId];
        }
        const currency = currencies.find(currency => currency.id == currencyId);
        this.currencySymbol = currency ? currency.symbol : '';
    }

    /**
     * set formatted field value
     */
    private setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            this.value = this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]));
        } else {
            this.value = '';
        }
    }
}
