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
    templateUrl: '../templates/reporterintegrationqueryanalyzerbutton.html'
})
export class ReporterIntegrationQueryanalyzerButton {

    constructor(public language: language, public modal: modal, public injector: Injector) {
    }

    /**
     * opens the modal
     */
    public showModal() {
        this.modal.openModal('ReporterIntegrationQueryanalyzerModal', true, this.injector);
    }
}
