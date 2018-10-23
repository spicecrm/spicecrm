import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';
import { userpreferences } from '../../services/userpreferences.service';

@Component({
    selector: 'field-currency',
    templateUrl: './src/objectfields/templates/fieldcurrency.html'
})
export class fieldCurrency extends fieldGeneric implements OnInit {

    currencies: Array<any> = [];
    currencyidfield: string = '';
    textvalue = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences ) {
        super(model, view, language, metadata, router);
        this.currencies = this.currency.getCurrencies();
    }

    ngOnInit(){
        this.currencyidfield = this.fieldconfig.field_currencyid;
        this.textvalue = this.getValAsText();
        this.model.data$.subscribe( () => {
            this.textvalue = this.getValAsText();
        });
    }

    getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;
        if ( this.currencyidfield ) {
            if( !this.model.data[this.currencyidfield] ) return '';
            else currencyid = this.model.data[this.currencyidfield];
        }
        this.currencies.some(currency => {
            if(currency.id == currencyid){
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }

    getValAsText() {
        if ( this.value === undefined ) return '';
        let val = parseFloat( this.value );
        if ( isNaN( val )) return '';
        return this.userpreferences.formatMoney( val );
    }

    changed() {
        let val: any = this.textvalue;
        val = val.split( this.userpreferences.toUse.num_grp_sep ).join('');
        val = val.split( this.userpreferences.toUse.dec_sep ).join('.');
        if ( isNaN( val = parseFloat( val ))) {
            this.value = '';
        } else {
            this.value = Math.floor( val * Math.pow( 10, this.userpreferences.toUse.default_currency_significant_digits )) / Math.pow( 10, this.userpreferences.toUse.default_currency_significant_digits );
        }
        this.textvalue = this.getValAsText();
    }

}