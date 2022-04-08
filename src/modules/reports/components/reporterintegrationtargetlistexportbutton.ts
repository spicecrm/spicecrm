/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-targetlistexport-button',
    templateUrl: '../templates/reporterintegrationtargetlistexportbutton.html'
})
export class ReporterIntegrationTargetlistexportButton {

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, public reporterconfig: reporterconfig) {
    }

    public showModal(): void {
        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }
        this.modal.openModal('ReporterIntegrationTargetlistexportModal').subscribe(popup => {
            popup.instance.model = this.model;
            popup.instance.whereConditions = whereConditions;
        });
    }
}
