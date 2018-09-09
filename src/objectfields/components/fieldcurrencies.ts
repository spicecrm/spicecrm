import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-currencies',
    templateUrl: './src/objectfields/templates/fieldcurrencies.html'
})
export class fieldCurrencies extends fieldGeneric{

    currencies: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private currency: currency) {
        super(model, view, language, metadata, router);

        this.currencies = this.currency.getCurrencies();
    }

    getCurrencySymbol(){
        let currencySymbol = '';

        if(!this.model.data[this.fieldname]) return currencySymbol;

        let currencyid = -99;
        if(this.fieldname){
            this.model.data[this.fieldname];
        }
        this.currencies.some(currency => {
            if(currency.id == currencyid){
                currencySymbol = currency.symbol;
                return true;
            }
        })
        return currencySymbol;

    }
}