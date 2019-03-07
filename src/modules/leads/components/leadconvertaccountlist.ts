/**
 * @module ModuleLeads
 */
import { Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {fts} from '../../../services/fts.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'lead-convert-account-list',
    templateUrl: './src/modules/leads/templates/leadconvertaccountlist.html'
})
export class LeadConvertAccountList {

    @Input() matchedaccounts: Array<any> = [];
    @Output() selectaccount: EventEmitter<any> = new EventEmitter<any>();
    listfields: Array<any> = [];

    constructor(private metadata: metadata, private model: model, private fts: fts, private language: language) {
        let componentconfig = this.metadata.getComponentConfig('LeadConvertAccountList', this.model.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if (listField.fieldconfig.default !== false)
                this.listfields.push(listField);
        }
    }

    selectitem(event){
        this.selectaccount.emit(event);
    }
}