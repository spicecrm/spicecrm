/**
 * @module ModuleReportsMore
 */
import {Component, Injector} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';

/**
 * renders the query analyzer button
 */
@Component({
    selector: 'reporter-integration-queryanalyzer-button',
    templateUrl: './src/modules/reportsmore/templates/reporterintegrationqueryanalyzerbutton.html'
})
export class ReporterIntegrationQueryanalyzerButton {

    constructor(private language: language, private modal: modal, private injector: Injector) {
    }

    /**
     * opens the modal
     */
    private showModal() {
        this.modal.openModal('ReporterIntegrationQueryanalyzerModal', true, this.injector);
    }
}