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
        return !Array.isArray(values) ? [] : values.filter(v => v.deleted != 1);
    }
}
