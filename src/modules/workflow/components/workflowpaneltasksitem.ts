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
    templateUrl: '../templates/workflowpaneltasksitem.html',
    providers:[view]

})
export class WorkflowPanelTasksItem implements OnInit{

    constructor(public model: model, public language: language, public view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit(): void {
        this.model.setField('_displayComments', false, true);
    }

    public toggleComments(){
        this.model.setField('_displayComments', !this.model.getField('_displayComments'), true);
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
            case '40':
                return 'close';
        }
    }
}
