/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'workflow-manager-task-types-decision',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypesdecision.html',
})
/**
 * handle managing the workflow task decision type
 */
export class WorkflowManagerTaskTypesDecision {

    constructor(private model: model, private modelutilities: modelutilities) {

    }

    /**
     * adds a new decision
     */
    private addDecision() {

        if (!this.model.data.type_config.decisions) {
            this.model.data.type_config.decisions = [];
        }

        this.model.data.type_config.decisions.push({
            id: this.modelutilities.generateGuid(),
            workflowtaskdefinition_id: this.model.id,
            deleted: 0,
            name: 'new Decision',
            acl: {
                create: true,
                edit: true
            }
        });
    }
}
