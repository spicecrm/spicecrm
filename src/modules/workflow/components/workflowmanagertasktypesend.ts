/**
 * @module ModuleWorkflow
 */
import {Component,} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

/**
 * @ignore
 */
declare var _;

/**
 * handle managing the workflow task start type
 */
@Component({
    selector: 'workflow-manager-task-types-end',
    templateUrl: '../templates/workflowmanagertasktypesend.html',
})
export class WorkflowManagerTaskTypesEnd {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService) {
    }
}
