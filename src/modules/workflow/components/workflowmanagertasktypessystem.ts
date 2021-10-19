/**
 * @module ModuleWorkflow
 */
import {Component,} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'workflow-manager-task-types-system',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypessystem.html',
})
/**
 * handle managing the workflow task system type
 */
export class WorkflowManagerTaskTypesSystem {

    constructor(public model: model) {

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

    public handleDelete(id: string) {
        // todo remove from array
    }
}
