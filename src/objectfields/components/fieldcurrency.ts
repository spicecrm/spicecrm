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
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-currency',
    templateUrl: './src/objectfields/templates/fieldcurrency.html'
})
export class fieldCurrency extends fieldGeneric implements OnInit {

    /**
     * the reference to the input element
     * @private
     */
    @ViewChild('floatinput', {static: false}) private inputel: ElementRef;

    /**
     * the formatted value
     * @private
     */
    private textvalue: string = '';

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    /**
     * the reference to the field with the currency id
     */
    private currencyidfield: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.currencyidfield = this.fieldconfig.field_currencyid;

        // if not check if the modl has a currncy_id field
        if (!this.currencyidfield) {
            let modelFields = this.metadata.getModuleFields(this.model.module);
            if (modelFields.currency_id) this.currencyidfield = 'currency_id';
        }

        // set teh default currency ID
        this.setDefaultCurrencyId();

        // get the formatted value
        this.textvalue = this.getValAsText();
        this.subscriptions.add(this.model.data$.subscribe(() => {
            this.textvalue = this.getValAsText();
        }));

        this.setCurrencyFromPreferences();
    }

    /**
     * sets a default currency id fromt he preferences or if nothing is set to -99
     * @private
     */
    private setDefaultCurrencyId() {
        if (this.currencyidfield) {
            if (!this.model.getField(this.currencyidfield)) {
                let preferredCurrency = this.userpreferences.getPreference('currency');
                if (preferredCurrency) {
                    this.currencyId = preferredCurrency;
                } else {
                    this.currencyId = '-99';
                }
            }
        }
    }

    /**
     * setter for teh currency ID
     *
     * @param currencyId
     */
    set currencyId(currencyId) {
        if (this.currencyidfield) {
            this.model.setField(this.currencyidfield, currencyId);
        }
    }

    /**
     * a getter for the currency ID
     */
    get currencyId() {
        let currencyid = -99;
        if (this.currencyidfield) {
            return this.model.getField(this.currencyidfield);
        }
        return currencyid;
    }

    /**
     * helper to get the currency symbol
     */
    private getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;
        if (this.currencyidfield) {
            if (!this.model.data[this.currencyidfield]) return '';
            else currencyid = this.model.data[this.currencyidfield];
        }
        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }

    private getValAsText() {
        if (this.value === undefined) return '';
        let val = parseFloat(this.value);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val);
    }

    private checkInput(e) {
        let allowedKeys = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete'];
        let regex = /^[0-9.,]+$/;
        if (!regex.test(e.key) && allowedKeys.indexOf(e.key) < 0) {
            e.preventDefault();
            console.log(e.key);
        }
    }

    private changed() {
        let curpos = this.inputel.nativeElement.selectionEnd;
        let val: any = this.textvalue;
        val = val.split(this.userpreferences.toUse.num_grp_sep).join('');
        val = val.split(this.userpreferences.toUse.dec_sep).join('.');
        if (isNaN(val = parseFloat(val))) {
            this.value = '';
        } else {
            this.value = (Math.round(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits));
        }
        this.textvalue = this.getValAsText();
        // set a brieftimeout and set the current pos back to the field tricking the Change Detection
        setTimeout(() => {
            this.inputel.nativeElement.selectionEnd = curpos;
        });
    }

    /**
     * handle view mode change to set the currency id from user preferences if editing is true
     * @param mode
     */
    public handleViewModeChange(mode) {
        if (mode == 'edit') {
            this.setCurrencyFromPreferences();
        }
        super.handleViewModeChange(mode);

    }

    /**
     * load currency id from user preferences
     * @private
     */
    private setCurrencyFromPreferences() {
        if (!!this.currencyidfield && !this.model.data[this.currencyidfield]) {
            this.model.data[this.currencyidfield] = this.userpreferences.toUse.currency;
        }
    }
}
