/**
 * @module ModuleWorkflow
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

@Component({
    selector: 'workflow-manager-task-types-standard',
    templateUrl: 'src/modules/workflow/templates/workflowmanagertasktypesstandard.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkflowManagerTaskTypesStandard {
    constructor(public model: model,
                public workflowManagerService: WorkflowManagerService
    ) {
    }
}
