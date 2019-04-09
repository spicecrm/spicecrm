/**
 * @module ModuleWorkflow
 */
import {
    Component, OnInit, Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'workflow-panel-tasks',
    templateUrl: './src/modules/workflow/templates/workflowpaneltasks.html'

})
export class WorkflowPanelTasks {

    @Input() private workflowtasks: any[] = [];

    constructor(private model: model, private workflow: workflow, private language: language, private broadcast: broadcast) {
    }


    private getStatusIcon(status) {
        switch (status) {
            case '5':
                return 'clock';
            case '10':
                return 'threedots';
            case '20':
                return 'play';
            case '30':
                return 'check';
        }
    }
}