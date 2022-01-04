/**
 * @module ModuleWorkflow
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {model} from "../../../services/model.service";

@Component({
    selector: '[workflow-manager-detail-tasksystemactions-line]',
    templateUrl: '../templates/workflowmanagerdetailtasksystemactionsline.html'
})
export class WorkflowManagerDetailTaskSystemactionsLine {

    @Input() public systemaction: any = {};
    @Input() public field: string = '';

    constructor(public modal: modal,
                public language: language,
                public model: model,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * remove the decision option from the available options
     * @private
     */

    public removeDecision() {
        this.modal.confirm(this.language.getLabel('MSG_DELETE_RECORD', null, 'long'), 'MSG_DELETE_RECORD').subscribe(answer => {
            if (answer) {
                this.model.data.type_config.systemactions = this.model.data.type_config.systemactions.filter(e => e.id != this.systemaction.id);
            }
        });
    }
}
