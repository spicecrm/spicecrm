/**
 * @module ModuleWorkflow
 */
import {Pipe} from '@angular/core';
import {session} from '../../../services/session.service';

/**
 * a pipe that returns only open tasks for the current user
 */
@Pipe({
    name: 'excludedeletedpipe',
    pure: false
})
export class ExcludeDeletedPipe {

    constructor(public session: session) {

    }

    public transform(values) {
        let retvalues = [];

        if (values) {
            for (let value of values) {
                if (value.deleted == 0) {
                    retvalues.push(value);
                }
            }
        }

        return retvalues;
    }
}
