/**
 * @module ModuleWorkflow
 */
import {
    Component, OnInit, Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * renders a <tr> row in the workflow-panel-tasks component
 */
@Component({
    selector: '[workflow-panel-tasks-item]',
    templateUrl: './src/modules/workflow/templates/workflowpaneltasksitem.html',
    providers:[view]

})
export class WorkflowPanelTasksItem {

    constructor(private model: model, private language: language, private view: view) {
        this.view.displayLabels = false;
    }

    /**
     * returns a specific icon based ont he statuis of the workflow task
     */
    get statusIcon() {
        switch (this.model.getField('status')) {
            case '5':
                return 'clock';
            case '10':
                return 'hierarchy';
            case '20':
                return 'play';
            case '30':
                return 'check';
        }
    }
}