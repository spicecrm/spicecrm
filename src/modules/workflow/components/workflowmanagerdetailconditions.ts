/**
 * @module ModuleWorkflow
 */
import {
    Component, Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

declare var _: any;

/**
 * renders the conditions panel for a given workflow
 */
@Component({
    selector: 'workflow-manager-detail-conditions',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailconditions.html',
    providers: [view]
})
export class WorkflowManagerDetailConditions {

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * getter for teh conditions stored on the workflow definition
     */
    get conditions() {
        // get from the model
        let conditions = this.model.getField('conditions');

        // if none are set initialize
        if (!conditions || (_.isArray(conditions) && _.isEmpty(conditions))) {
            conditions = {
                logicaloperator: 'and',
                groupscope: 'all',
                conditions: []
            };
            this.model.setField('conditions', conditions);
        }

        // return the object
        return conditions;
    }

    /**
     * a simple getter for the module
     */
    get module() {
        return this.model.getField('workflowdefinition_module');
    }
}
