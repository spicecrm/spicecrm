/**
 * @module ModuleProjects
 */

import {Component, Injector, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";


@Component({
    selector: "projectwbs-status-report-button",
    templateUrl: "./src/modules/projects/templates/projectwbsstatusreportbutton.html",

})

export class ProjectWBSStatusReportButton {
    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private toast: toast
    ) {
    }

    public execute() {
        this.modal.openModal('ProjectWBSStatusReportModal', true, this.injector);
    }

}

