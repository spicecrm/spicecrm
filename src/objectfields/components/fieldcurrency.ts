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
    templateUrl: '../templates/fieldcurrency.html'
})
export class fieldCurrency extends fieldGeneric implements OnInit {

    /**
     * the reference to the input element
     * @private
     */
    @ViewChild('floatinput', {static: false}) public inputel: ElementRef;

    /**
     * the formatted value
     * @private
     */
    public textvalue: string = '';

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

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

    public getValAsText() {
        if (this.value === undefined) return '';
        let val = parseFloat(this.value);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val);
    }

    public checkInput(e) {
        let allowedKeys = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete'];
        let regex = /^[0-9.,]+$/;
        if (!regex.test(e.key) && allowedKeys.indexOf(e.key) < 0) {
            e.preventDefault();
            console.log(e.key);
        }
    }

    public changed() {
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
    public setCurrencyFromPreferences() {
        if (!!this.currencyidfield && !this.model.getField(this.currencyidfield)) {
            this.model.setField(this.currencyidfield, this.userpreferences.toUse.currency);
        }
    }
}
