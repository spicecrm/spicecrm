/**
 * @module ModuleWorkflow
 */
import {
    Component, Input, OnInit
} from '@angular/core';

import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

declare var moment: any;

@Component({
    templateUrl: '../templates/workflowcloseworkflowbutton.html',

})
export class WorkflowCloseWorkflowButton {

    constructor(public model: model, public modal: modal, public backend: backend, public session: session, public language: language, public toast: toast) {
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        return this.model.getField('workflow_status') == '40' || !this.session.authData.admin;
    }

    /*
    * close the task
    */
    public execute() {
        this.modal.confirm(this.language.getLabel('MSG_CLOSE_WORKFLOW', '', 'long'), this.language.getLabel('MSG_CLOSE_WORKFLOW')).subscribe(response => {
            if (response) {
                let spinner = this.modal.await('closing');
                this.backend.postRequest(`module/Workflows/${this.model.id}/close`).subscribe(
                    completed => {
                        spinner.emit(true);
                        this.model.getData(true);
                    },
                    error => {
                        spinner.emit(true);
                        this.toast.sendToast(this.language.getLabel('MSG_ERROR_CLOSING_WORKFLOW'), 'error');
                    });
            }
        });
    }

}
