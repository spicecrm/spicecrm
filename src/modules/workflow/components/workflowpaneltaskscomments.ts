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
    templateUrl: './src/modules/workflow/templates/workflowpaneltaskscomments.html',

})
export class WorkflowPanelTasksComments {

    /**
     * an array of comment objects
     */
    @Input() private comments: any[] = [];

    constructor(private userpreferences: userpreferences, private language: language) {
    }


    /**
     * formats and outputs a date
     *
     * @param date
     */
    private startdate(date) {
        return this.userpreferences.formatDateTime(date);
    }


}
