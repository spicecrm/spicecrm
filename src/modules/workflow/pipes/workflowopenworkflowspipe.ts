/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';

/**
 * a poipe that returns only open workflows
 */
@Pipe({
    name: 'workflowpenworkflowspipe',
    pure: false
})
export class WorkflowOpenWorkflowsPipe {

    /**
     * @ignore
     *
     * @param values
     */
    public transform(values) {
        return values.filter(w => parseInt(w.workflow_status, 10) >= 10 && parseInt(w.workflow_status, 10) < 30);
    }
}