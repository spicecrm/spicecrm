/**
 * @module ModuleWorkflow
 */
import {
    Component, OnInit, OnDestroy, Pipe
} from '@angular/core';
import {session} from '../../../services/session.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'workflow-panel',
    templateUrl: './src/modules/workflow/templates/workflowpanel.html',
    providers: [workflow]
})
export class WorkflowPanel implements OnInit, OnDestroy{

    broadcastSubscription: any = {};

    constructor(private model: model, private workflow: workflow, private language: language, private broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        })
    }

    ngOnInit(){
        this.workflow.getWorkflowsForModule(this.model.module, this.model.id);
    }

    ngOnDestroy(){
        this.broadcastSubscription.unsubscribe();
    }

    handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id)
            return;

        switch (message.messagetype) {
            case 'model.save':
                this.workflow.getWorkflowsForModule(this.model.module, this.model.id);
                break;

        }
    }
}


@Pipe({
    name: 'myopentasks',
    pure: false
})
export class myopentaskspipe {

    constructor(private session: session){

    }

    transform(values) {
        let retvalues = [];

        if(values) {
            for (let value of values) {
                if (parseInt(value.status) < 30 && (value.assigned_user_id == this.session.authData.userId || this.session.authData.admin))
                    retvalues.push(value);
            }
        }

        return retvalues;
    }
}

@Pipe({
    name: 'openworkflows',
    pure: false
})
export class openworkflowspipe {

    constructor(){

    }

    transform(values) {
        let retvalues = [];

        if(values) {
            for (let value of values) {
                if (parseInt(value.workflow_status) < 30)
                    retvalues.push(value);
            }
        }

        return retvalues;
    }
}