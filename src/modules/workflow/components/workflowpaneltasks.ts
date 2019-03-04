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
export class WorkflowPanelTasks implements OnInit{

    @Input()workflowtasks: Array<any> = [];
    selectedTask: string = '';

    constructor(private model: model, private workflow: workflow, private language: language, private broadcast: broadcast) {

    }

    ngOnInit(){
        if(this.workflowtasks.length > 0){
            this.selectedTask = this.workflowtasks[this.workflowtasks.length - 1].id;
        };
    }

    getStatusIcon(status){
        switch(status){
            case '10':
                return 'right'
            case '20':
                return 'clock'
            case '30':
                return 'check'
        }
    }
}