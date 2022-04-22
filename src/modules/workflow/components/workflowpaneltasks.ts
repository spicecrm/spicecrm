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
import moment from "moment";

/**
 * renders the panel withj the workflow tasks for a given Bean
 */
@Component({
    selector: 'workflow-panel-tasks',
    templateUrl: '../templates/workflowpaneltasks.html'

})
export class WorkflowPanelTasks implements OnInit{

    /**
     * an array of workflow tasks
     */
    @Input() public workflowtasks: any[] = [];

    constructor(public model: model, public workflow: workflow, public language: language, public broadcast: broadcast) {
    }

    /**
     * on init sort the tasks by date entered
     */
    public ngOnInit() {
        this.workflowtasks.sort((a, b) => {
            return moment(a.date_entered).isBefore(moment(b.date_entered)) ? -1 : 1;
        })
    }

}
