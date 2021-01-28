/**
 * @module ModuleProjects
 */

import {Component, Injector, OnInit} from "@angular/core";
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";


@Component({
    selector: "projectwbs-status-report-modal",
    templateUrl: "./src/modules/projects/templates/projectwbsstatusreportmodal.html",

})

export class ProjectWBSStatusReportModal {
    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any = {};

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private modellist: modellist,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }
}

