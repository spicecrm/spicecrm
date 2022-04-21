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

    constructor(public metadata: metadata, public model: model, public workflowManagerService: WorkflowManagerService) {

    }

    get tasks(): WorkflowTaskDefI[] {
        return this.workflowManagerService.tasks;
    }
}
