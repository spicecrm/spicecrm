/**
 * @module ModuleWorkflow
 */
import {Component, OnInit, OnDestroy, Optional} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from "../../../services/modal.service";
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'workflow-panel',
    templateUrl: '../templates/workflowpanel.html',
    providers: [workflow]
})
export class WorkflowPanel implements OnInit, OnDestroy {

    /**
     * pointer to the subscription on teh broiadcast service
     */
    public subscriptions = new Subscription();
    /**
     * holds the parent module
     * @private
     */
    private parentModule: string;
    /**
     * holds the parent module
     * @private
     */
    private parentId: string;
    /**
     * @ignore
     */
    constructor(@Optional() public model: model,
                public workflow: workflow,
                public language: language,
                public modal: modal,
                private navigationTab: navigationtab,
                public broadcast: broadcast) {

        this.parentId = this.model?.id;
        this.parentModule = this.model?.module;

        if (!this.model?.id) {

            this.navigationTab.setTabInfo({displayname: 'LBL_WORKFLOWS', displaymodule: 'Workflows'});

            this.navigationTab.activeRoute$.subscribe(route => {
                this.parentModule = route.params.module;
                this.parentId = route.params.id;
            });
        }

        this.subscriptions.add(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
    }

    /**
     * @ignore
     *
     * get the workflows
     */
    public ngOnInit() {
        this.workflow.getWorkflowsForModule(this.parentModule, this.parentId);
    }

    /**
     * @ignore
     *
     * cancel the boadcast subscription
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
        if (message.messagedata.module !== this.parentModule && message.messagedata.id !== this.parentId) return;

        switch (message.messagetype) {
            case 'model.save':
                this.workflow.getWorkflowsForModule(this.parentModule, this.parentId);
                break;

        }
    }
}
