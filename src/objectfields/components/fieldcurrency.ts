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
    templateUrl: '../templates/fieldcurrency.html'
})
export class fieldCurrency extends fieldGeneric implements OnInit {

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    /**
     * number of digits after decimal separator
     * user default preference
     * override with fieldconfig value if set
     */
    public precision: number = 0;

    /**
     * Tells if field shall also render a currency symbol
     */
    public currencyFormat: boolean = true;

    /**
     * the reference to the field with the currency id
     */
    public currencyidfield: string = '';


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // set decimal precision
        this.precision = (this.fieldconfig.precision === undefined || this.fieldconfig.precision === '' ? parseInt(this.userpreferences.toUse.currency_significant_digits, 10) : parseInt(this.fieldconfig.precision, 10));

        this.currencyidfield = this.fieldconfig.field_currencyid;

        // if not check if the modl has a currncy_id field
        if (!this.currencyidfield) {
            let modelFields = this.metadata.getModuleFields(this.model.module);
            if (modelFields.currency_id) this.currencyidfield = 'currency_id';
        }

        // set thh default currency ID
        this.setDefaultCurrencyId();

        this.setCurrencyFromPreferences();
    }

   /**
     * sets a default currency id from the preferences or if nothing is set to -99
     */
    public setDefaultCurrencyId() {
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
     * setter for the currency ID
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
    public getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;
        if (this.currencyidfield) {
            if (!this.model.getField(this.currencyidfield)) return '';
            else currencyid = this.model.getField(this.currencyidfield);
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
    public setCurrencyFromPreferences() {
        if (!!this.currencyidfield && !this.model.getField(this.currencyidfield)) {
            this.model.setField(this.currencyidfield, this.userpreferences.toUse.currency);
        }
    }
}
