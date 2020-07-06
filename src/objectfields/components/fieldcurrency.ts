/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
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
    }

    get currencyId(){
        let currencyid = -99;
        if (this.currencyidfield) {
            if (!this.model.data[this.currencyidfield]) return '';
            else currencyid = this.model.data[this.currencyidfield];
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

    /**
     * override the getter for the value
     */
    get value() {
        let fieldval = this.model.getFieldValue(this.fieldname);

        if (fieldval === undefined) return '';
        let val = parseFloat(fieldval);
        if (isNaN(val)) return '';
        return val;
        return this.userpreferences.formatMoney(val);
    }

    /**
     * override the setter for the value
     *
     * @param val
     */
    set value(val) {
        val = val.split(this.userpreferences.toUse.num_grp_sep).join('');
        val = val.split(this.userpreferences.toUse.dec_sep).join('.');
        if (isNaN(val = parseFloat(val))) {
            this.model.setField(this.fieldname, '');
        } else {
            // this.value = Math.floor(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits);
            this.model.setField(this.fieldname, Math.floor(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits))
        }
    }
}
