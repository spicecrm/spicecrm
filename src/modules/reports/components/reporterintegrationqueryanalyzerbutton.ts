import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-queryanalyzer-button',
    templateUrl: './app/modules/reports/templates/reporterintegrationqueryanalyzerbutton.html'
})
export class ReporterIntegrationQueryanalyzerButton {

    constructor( private language: language, private metadata: metadata, private model: model, private modal: modal, private reporterconfig: reporterconfig) {
    }

    showModal(){

        let whereConditions: Array<any> = [];
        for(let userFilter of this.reporterconfig.userFilters){
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            })
        }
        this.modal.openModal('ReporterIntegrationQueryanalyzerModal').subscribe(popup => {
            popup.instance['model'] = this.model;
            popup.instance['whereConditions'] = whereConditions;
        })
    }
}