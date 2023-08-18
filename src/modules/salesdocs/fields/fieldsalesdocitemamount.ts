/**
 * @module ModuleSalesDocs
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {currency} from '../../../services/currency.service';
import {modal} from '../../../services/modal.service';
import {userpreferences} from '../../../services/userpreferences.service';

import {Router} from '@angular/router';
import {fieldCurrency} from "../../../objectfields/components/fieldcurrency";

@Component({
    selector: 'field-salesdoc-item-amount',
    templateUrl: '../templates/fieldsalesdocitemamount.html'
})
export class fieldSalesdocItemAmount extends fieldCurrency {


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences, public modal: modal, public injector: Injector) {
        super(model, view, language, metadata, router, currency, userpreferences);
    }

    get isCalculated(){
        return !!this.model.getField('salesdocitempricedetermination');
    }

    /**
     * checks if the field is editbale
     *
     * @param field optional the fieldname
     */
    public isEditable(field: string = this.fieldname): boolean {
        return !this.isCalculated && super.isEditable(field)
    }

    public openCalculation(){
        this.modal.openModal('SalesDocsItemCalculate', true, this.injector);
    }

}
