/**
 * @module ModuleTeleSales
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tele_sales_cockpit_create_lead_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitcreateleadbutton.html',
    providers: [model]
})
export class TeleSalesCockpitCreateLeadButton {

    public parent: any;

    constructor(private language: language, private model: model) {
        this.model.module = 'Leads';
    }

    public execute() {
        this.model.id = '';
        this.model.addModel('', this.parent);
    }
}
