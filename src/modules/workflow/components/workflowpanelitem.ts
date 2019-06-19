/**
 * @module ModuleWorkflow
 */
import {
    Component, Input, OnInit
} from '@angular/core';

import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'workflow-panel-item',
    templateUrl: './src/modules/workflow/templates/workflowpanelitem.html',

})
export class WorkflowPanelItem {

    @Input() private workflow: any = {};

    private hidebody: boolean = false

    constructor(private model: model, private language: language, private broadcast: broadcast) {
    }

    private toggleHidden() {
        this.hidebody = !this.hidebody;
    }

    get toggleicon() {
        return this.hidebody ? 'chevrondown' : 'chevronup';
    }

}