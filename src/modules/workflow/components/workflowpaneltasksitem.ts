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

}
