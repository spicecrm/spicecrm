/**
 * @module ModuleWorkflow
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-detail-task-taskpanel',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasktaskpanel.html'
})
export class WorkflowManagerDetailTaskTaskpanel {

    constructor(private metadata: metadata, private model: model, private workflowManagerService: WorkflowManagerService) {

    }

    get tasks() {
        return this.workflowManagerService.tasks;
    }

    get previousTaskDisabled() {
        return this.model.data && this.model.data.primarytask;
    }
}
