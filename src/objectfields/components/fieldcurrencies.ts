/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * renders a field that allows selection of currencies
 */
@Component({
    selector: 'field-currencies',
    templateUrl: '../templates/fieldcurrencies.html'
})
export class fieldCurrencies extends fieldGeneric {

    public currencies: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency) {
        super(model, view, language, metadata, router);

        this.currencies = this.currency.getCurrencies();
    }

    public getCurrencySymbol() {
        let currencyid = -99;

        if (this.model.getField(this.fieldname)) currencyid = this.model.getField(this.fieldname);
        return this.currency.getCurrencySmbol(currencyid);
    }
}
