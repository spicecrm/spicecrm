/**
 * @module ObjectComponents
 */
import {Component, OnDestroy} from '@angular/core';
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {navigationtab} from "../../services/navigationtab.service";
import {Router} from "@angular/router";
import {backend} from "../../services/backend.service";
import {Subscription} from "rxjs";
import {broadcast} from "../../services/broadcast.service";

/**
 * open workflows in a new tab for a bean
 */
@Component({
    selector: 'object-workflow-button',
    templateUrl: '../templates/objectworkflowbutton.html'
})
export class ObjectWorkflowButton implements OnDestroy {
    /**
     * true if the workflow flag is active for the module in sysmodules
     */
    public workflowEnabled: boolean = false;
    /**
     * holds the open workflows count
     */
    public openWorkflowsCount: number = 0;
    /**
     * holds the rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();

    constructor(private metadata: metadata,
                private navigationTab: navigationtab,
                private router: Router,
                private backend: backend,
                private broadcast: broadcast,
                private model: model) {
        this.initialize();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * check if the model has workflow enabled
     * @private
     */
    private initialize() {

        this.workflowEnabled = this.metadata.getModuleDefs('Workflows') && this.metadata.getModuleDefs(this.model.module).workflow;

        if (!this.workflowEnabled) return;

        this.getOpenWorkflowsCount();

        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => this.handleMessage(msg))
        );
    }

    /**
     * open bean related workflows in a new tab
     */
    public open() {
        const routePrefix = this.navigationTab?.tabid ? '/tab/' + this.navigationTab.tabid : '';
        this.router.navigate([`${routePrefix}/module/${this.model.module}/${this.model.id}/workflows`]);
    }

    /**
     * gets the copunt of open workflows from teh backend
     *
     * @private
     */
    private getOpenWorkflowsCount(){
        this.backend.getRequest(`module/Workflows/forparent/${this.model.module}/${this.model.id}/open`).subscribe({
            next: (res) => this.openWorkflowsCount = res.count
        });
    }

    public handleMessage(message: any) {

        if (message.messagetype == 'workflows.reload') {
            return this.getOpenWorkflowsCount();
        }

        // only handle if the module is the one in focus
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id){
            return;
        }

        switch (message.messagetype) {
            case 'model.save':
                this.getOpenWorkflowsCount();
                break;
            case 'workflows.loaded':
                this.openWorkflowsCount = message.messagedata.workflowcount;
                break;
        }
    }
}
