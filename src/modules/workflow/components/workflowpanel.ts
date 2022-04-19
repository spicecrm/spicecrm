/**
 * @module ModuleWorkflow
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'workflow-panel',
    templateUrl: '../templates/workflowpanel.html',
    providers: [workflow]
})
export class WorkflowPanel implements OnInit, OnDestroy {

    /**
     * pointer to the subscription on teh broiadcast service
     */
    public broadcastSubscription: any = {};

    /**
     * @ignore
     */
    constructor(public model: model,
                public workflow: workflow,
                public language: language,
                public modal: modal,
                public broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * @ignore
     *
     * get the workflows
     */
    public ngOnInit() {
        this.workflow.getWorkflowsForModule(this.model.module, this.model.id);
    }

    /**
     * @ignore
     *
     * cancel the boadcast subscription
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }

    /**
     * mesage handler for the broacast subscription
     *
     * in case the current model is saved it reloads the workflows since that might have resulted in changes
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id) return;

        switch (message.messagetype) {
            case 'model.save':
                this.workflow.getWorkflowsForModule(this.model.module, this.model.id);
                break;

        }
    }
}
