/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';

declare var moment: any;

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
        let retvalues = [];

        if (values) {
            for (let value of values) {
                if (parseInt(value.workflow_status, 10) >= 10 && parseInt(value.workflow_status, 10) >= 30) {
                    retvalues.push(value);
                }
            }
        }

        retvalues.sort((a, b) => {
            let astart = new moment(a.date_entered);
            let bstart = new moment(b.date_entered);
            return astart.isBefore(bstart) ? 1 : -1;
        });

        return retvalues;
    }
}
