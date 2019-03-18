/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: '[lead-convert-account-list-item]',
    templateUrl: './src/modules/leads/templates/leadconvertaccountlistitem.html',
    providers: [model, view]
})
export class LeadConvertAccountListItem implements OnInit{

    @Input() matchedaccount: any = {};
    @Input() listfields: Array<any> = [];
    @Output() selectitem: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private model: model, private view: view, private language: language) {
        this.view.isEditable = false;
    }

    ngOnInit(){
        this.model.module = this.matchedaccount._type;
        this.model.id = this.matchedaccount._id;
        this.model.data = this.matchedaccount._source;
    }

    selectAccount(){
        this.selectitem.emit({id: this.matchedaccount._id, name: this.matchedaccount._source.name, billing_address_city: this.matchedaccount._source.billing_address_city});
    }
}