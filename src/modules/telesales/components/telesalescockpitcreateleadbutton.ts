/**
 * @module ModuleTeleSales
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tele_sales_cockpit_create_lead_button',
    templateUrl: './src/modules/telesales/templates/telesalescockpitcreateleadbutton.html',
    providers: [model]
})
export class TeleSalesCockpitCreateLeadButton {

    public parent: any;

    constructor(private language: language, private metadata: metadata, private model: model, private footer: footer) {
        this.model.module = 'Leads';
    }

    public execute() {
        this.model.id = undefined;
        this.model.addModel('', this.parent);
    }
}