/**
 * @module ModuleWorkflow
 */
import {
    Component, OnInit, Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

/**
 * renders the panel withj the workflow tasks for a given Bean
 */
@Component({
    selector: 'workflow-panel-tasks',
    templateUrl: './src/modules/workflow/templates/workflowpaneltasks.html'

})
export class WorkflowPanelTasks {

    /**
     * an array of workflow tasks
     */
    @Input() private workflowtasks: any[] = [];

    constructor(private model: model, private workflow: workflow, private language: language, private broadcast: broadcast) {
    }
}
