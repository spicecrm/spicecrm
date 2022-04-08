/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldCurrency} from './fieldcurrency';
import {Router} from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-currency',
    templateUrl: '../templates/fieldweightedamount.html'
})
export class fieldWeightedAmount extends fieldCurrency {


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router, currency, userpreferences);

        this.currencies = this.currency.getCurrencies();
    }

    /**
     * a simple getter to get the amount field that is the base for the weighted amount
     */
    get amountfield() {
        return this.fieldconfig.field_amount ? this.fieldconfig.field_amount : 'amount';
    }

    /**
     * a simple getter to get the probability field
     */
    get probabilityfield() {
        return this.fieldconfig.field_probability ? this.fieldconfig.field_probability : 'probability';
    }


    public getValue() {

        try {
            let value = this.model.getFieldValue('amount') ? parseFloat(this.model.getFieldValue(this.amountfield)) : 0;
            let probability = this.model.getFieldValue('amount') ? parseFloat(this.model.getFieldValue(this.probabilityfield)) : 0;
            return this.userpreferences.formatMoney(value * probability / 100);

        } catch (e) {
            return 0;
        }

    }
}
