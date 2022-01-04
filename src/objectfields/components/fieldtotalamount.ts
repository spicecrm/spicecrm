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
    templateUrl: '../templates/fieldtotalamount.html'
})
export class fieldTotalAmount extends fieldCurrency {

    currencies: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences ) {
        super(model, view, language, metadata, router, currency, userpreferences);

        this.currencies = this.currency.getCurrencies();
    }

    get sumfields(){
        let sumfieldsArray = [];
        if(this.fieldconfig.sumfields) {
            let sumfields = this.fieldconfig.sumfields.split(',');
            for(let sumfield of sumfields){
                sumfieldsArray.push(sumfield.trim());
            }

        }
        return sumfieldsArray;

    }


    getValue() {
        let totalvalue = 0;

        for(let sumfield of this.sumfields){
            let fieldvalue = this.model.getFieldValue(sumfield);
            if(fieldvalue){
                totalvalue += parseFloat(fieldvalue);
            }
        }

        // set it to the model
        this.model.setField(this.fieldname, totalvalue);

        // return the value
        return this.userpreferences.formatMoney(totalvalue);
    }
}
