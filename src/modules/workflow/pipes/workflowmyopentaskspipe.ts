/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';
import {session} from '../../../services/session.service';

/**
 * a pipe that returns only open tasks for the current user
 */
@Pipe({
    name: 'workflowmyopentaskspipe',
    pure: false
})
export class WorkflowMyOpenTasksPipe {

    constructor(public session: session) {

    }

    public transform(values) {
        let retvalues = [];

        if (values) {
            for (let value of values) {
                if (parseInt(value.workflowtask_status, 10) >= 10 && parseInt(value.workflowtask_status, 10) < 30 && (value.assigned_user_id == this.session.authData.userId || this.session.authData.admin)) {
                    retvalues.push(value);
                }
            }
        }

        return retvalues;
    }
}
