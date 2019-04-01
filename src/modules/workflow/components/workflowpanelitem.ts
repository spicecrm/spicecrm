/**
 * @module ModuleWorkflow
 */
import {
    Component,Input, OnInit
} from '@angular/core';

import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'workflow-panel-item',
    templateUrl: './src/modules/workflow/templates/workflowpanelitem.html',

})
export class WorkflowPanelItem implements OnInit{

    @Input() workflow: any = {};

    hidebody : boolean = false

    constructor(private model: model, private workflowservice: workflow, private language: language, private broadcast: broadcast) {
        //this.model.module = 'Workflows';
    }

    ngOnInit(){
       // this.model.id = this.workflow.id;
    }

    toggleHidden(){
        this.hidebody = !this.hidebody;
    }

    get toggleicon(){
        return this.hidebody ? 'chevrondown' : 'chevronup';
    }

}