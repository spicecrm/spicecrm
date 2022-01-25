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
    selector: 'workflow-manager-task-types-start',
    templateUrl: '../templates/workflowmanagertasktypesstart.html',
})
export class WorkflowManagerTaskTypesStart {

    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService) {
    }
}
