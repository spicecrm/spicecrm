import { Component, Input } from '@angular/core';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';

@Component({
    selector: 'tele_sales_cockpit_create_lead_button',
    templateUrl: './app/modules/telesales/templates/telesalescockpitcreateleadbutton.html',
    providers: [model],
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'createLead()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class TeleSalesCockpitCreateLeadButton {

    parent: any = undefined;

    constructor( private language: language, private metadata: metadata, private model: model, private footer: footer) {
        this.model.module = 'Leads';
    }

    createLead(){
        this.model.id = undefined;
        this.model.addModel('', this.parent);
    }
}