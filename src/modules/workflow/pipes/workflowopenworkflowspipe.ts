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
        let retvalues = [];

        if (values) {
            for (let value of values) {
                if (parseInt(value.workflow_status, 10) >= 10 && parseInt(value.workflow_status, 10) < 30) {
                    retvalues.push(value);
                }
            }
        }

        return retvalues;
    }
}