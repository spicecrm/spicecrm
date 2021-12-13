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
    templateUrl: '../templates/workflowmanagerdetailconditions.html',
    providers: [view]
})
export class WorkflowManagerDetailConditions {

    constructor(public metadata: metadata, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.view.displayLabels = false;
    }

    /**
     * getter for teh conditions stored on the workflow definition
     */
    get conditions() {
        // get from the model
        return this.model.getField('conditions');
    }

    /**
     * simple setter for the conditions
     *
     * @param conditions
     */
    set conditions(conditions) {
        this.model.setField('conditions', conditions);
    }

    /**
     * getter for the conditions to end the workflow stored on the workflow definition
     */
    get conditions_end() {
        return this.model.getField('conditions_end');
    }

    /**
     * simple setter for eht conditions to end the workflow
     * @param conditions
     */
    set conditions_end(conditions) {
        this.model.setField('conditions_end', conditions);
    }

    /**
     * a simple getter for the module
     */
    get module() {
        return this.model.getField('workflowdefinition_module');
    }
}
