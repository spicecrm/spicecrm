/**
 * @module ModuleReportsMore
 */
import {Component, Input, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../../../modules/reports/services/reporterconfig';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: '../templates/salesplanningreporterintegrationexportbutton.html'
})
export class SalesPlanningReporterIntegrationExportButton {

    constructor(public language: language, public injector: Injector, public backend: backend, public model: model, public modal: modal, public reporterconfig: reporterconfig) {
    }

    get canExport() {
        return this.model.checkAccess('export');
    }

    public export() {
        this.modal.openModal('SalesPlanningReporterIntegrationExportModal', true, this.injector)
    }
}
