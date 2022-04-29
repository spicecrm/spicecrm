/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';

/**
 * a poipe that returns only open workflows
 */
@Pipe({
    name: 'workflowcompletedworkflowspipe',
    pure: false
})
export class WorkflowCompletedWorkflowsPipe {

    /**
     * @ignore
     *
     * @param values
     */
    public transform(values) {
        return values.filter(w => parseInt(w.workflow_status, 10) >= 30);
    }
}
