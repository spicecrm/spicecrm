/**
 * @module ModuleWorkflow
 */
import {
    Component, OnInit, Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * renders a status icon
 */
@Component({
    selector: 'workflow-task-status-icon',
    templateUrl: '../templates/workflowtaskstatusicon.html',

})
export class WorkflowTaskStatusIcon {

    /**
     * the status
     * @private
     */
    @Input() private status: string;

    /**
     * returns a specific icon based on the status
     */
    get statusIcon() {
        switch (this.status) {
            case '5':
                return 'clock';
            case '10':
                return 'hierarchy';
            case '20':
                return 'play';
            case '30':
                return 'check';
            case '40':
                return 'close';
        }
    }
}
