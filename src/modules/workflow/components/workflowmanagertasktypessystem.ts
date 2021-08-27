/**
 * @module ModuleWorkflow
 */
import {Component,} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'workflow-manager-task-types-system',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypessystem.html',
})
/**
 * handle managing the workflow task system type
 */
export class WorkflowManagerTaskTypesSystem {
    /**
     * holds the active tab
     */
    public activeTab: string = 'T';

    constructor(private model: model, private modelutilities: modelutilities) {

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
            id: this.modelutilities.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            acl: {
                create: true,
                edit: true
            }
        });
    }
}
