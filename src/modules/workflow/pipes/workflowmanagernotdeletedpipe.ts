/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';

/**
 * a poipe that returns only open workflows
 */
@Pipe({
    name: 'workflowmanagernotdeletedpipe',
    pure: false
})
export class WorkflowManagerNotDeletedPipe {
    public transform(values) {
        let retvalues = [];

        for (let value of values) {
            if (value.deleted != 1) {
                retvalues.push(value);
            }
        }

        return retvalues;
    }
}
