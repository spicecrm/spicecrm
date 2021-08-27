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
    templateUrl: './src/modules/salesplanning/templates/salesplanningreporterintegrationexportbutton.html'
})
export class SalesPlanningReporterIntegrationExportButton {

    constructor(private language: language, private injector: Injector, private backend: backend, private model: model, private modal: modal, private reporterconfig: reporterconfig) {
    }

    get canExport() {
        return this.model.checkAccess('export');
    }

    private export() {
        this.modal.openModal('SalesPlanningReporterIntegrationExportModal', true, this.injector)
    }
}
