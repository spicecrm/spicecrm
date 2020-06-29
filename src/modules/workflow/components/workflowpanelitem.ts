/**
 * @module ModuleWorkflow
 */
import {
    Component, Input, OnInit
} from '@angular/core';

import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;

@Component({
    selector: 'workflow-panel-item',
    templateUrl: './src/modules/workflow/templates/workflowpanelitem.html',

})
export class WorkflowPanelItem {

    @Input() private workflow: any = {};

    private hidebody: boolean = false;

    constructor(private userpreferences: userpreferences) {
    }

    private toggleHidden() {
        this.hidebody = !this.hidebody;
    }

    get toggleicon() {
        return this.hidebody ? 'chevrondown' : 'chevronup';
    }

    get startdate() {
        return this.userpreferences.formatDateTime(this.workflow.date_entered);
    }

}
