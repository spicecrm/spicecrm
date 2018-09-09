import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-targetlistexport-button',
    templateUrl: './app/modules/reports/templates/reporterintegrationtargetlistexportbutton.html'
})
export class ReporterIntegrationTargetlistexportButton {

    constructor( private language: language, private metadata: metadata, private model: model, private modal: modal, private reporterconfig: reporterconfig) {
    }

    showModal(){
        // build wherecondition
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
        this.modal.openModal('ReporterIntegrationTargetlistexportModal').subscribe(popup => {
            popup.instance['model'] = this.model;
            popup.instance['whereConditions'] = whereConditions;
        })
    }
}