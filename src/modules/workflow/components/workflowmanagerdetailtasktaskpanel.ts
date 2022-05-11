/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {WorkflowTaskDefI} from "../interfaces/workflow.interfaces";

@Component({
    selector: 'workflow-manager-detail-task-taskpanel',
    templateUrl: '../templates/workflowmanagerdetailtasktaskpanel.html'
})
export class WorkflowManagerDetailTaskTaskpanel {
    /**
     * true if the task type can use timing panel
     */
    public hasTiming: boolean = false;

    constructor(public metadata: metadata, public model: model, public workflowManagerService: WorkflowManagerService) {

    }

    public ngOnInit() {
        this.hasTiming = this.workflowManagerService.getType(this.model.data.tasktype).has_timing == 1;
    }

    get tasks(): WorkflowTaskDefI[] {
        return this.workflowManagerService.tasks;
    }
}
