/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'workflow-panel-task-comments',
    templateUrl: './src/modules/workflow/templates/workflowpaneltaskcomments.html'
})
export class WorkflowPanelTaskComments {

    constructor(private model: model, private language: language) {}

    get comments() {
       return this.model.getRelatedRecords('workflowtaskcomments');
    }
}
