/**
 * @module ModuleWorkflow
 */
import {
    Component, Input
} from '@angular/core';
import {language} from '../../../services/language.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;

/**
 * renders a <tr> row for the comment
 */
@Component({
    selector: '[workflow-panel-tasks-comments]',
    templateUrl: '../templates/workflowpaneltaskscomments.html',

})
export class WorkflowPanelTasksComments {

    /**
     * an array of comment objects
     */
    @Input() public comments: any[] = [];

    constructor(public userpreferences: userpreferences, public language: language) {
    }


    /**
     * formats and outputs a date
     *
     * @param date
     */
    public startdate(date) {
        return this.userpreferences.formatDateTime(date);
    }


}
