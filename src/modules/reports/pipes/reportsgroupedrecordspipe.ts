import {Pipe, PipeTransform} from '@angular/core';

/**
 * a poipe that returns only open workflows
 */
@Pipe({
    name: 'reportsgroupedrecordspipe',
    pure: false
})
export class ReportsGroupedRecordsPipe implements PipeTransform{

    /**
     * @ignore
     *
     * @param values
     */
    public transform(values, fieldid, fieldvalue) {
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