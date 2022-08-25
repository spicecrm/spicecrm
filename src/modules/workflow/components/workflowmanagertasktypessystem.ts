/**
 * @module ModuleWorkflow
 */
import {Component, EventEmitter, Output,} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {metadata} from '../../../services/metadata.service';
import {footer} from "../../../services/footer.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-system',
    templateUrl: '../templates/workflowmanagertasktypessystem.html',
})
/**
 * handle managing the workflow task system type
 */
export class WorkflowManagerTaskTypesSystem {
    constructor(public model: model, public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * add new system action
     * @private
     */
    public addAction() {

        if (!this.model.data.type_config.systemactions) {
            this.model.data.type_config.systemactions = [];
        }

        this.model.data.type_config.systemactions.push({
            id: this.model.generateGuid(),
            field: '',
            field_value: '',
            workflowtask_status: ''
        });
    }
}
