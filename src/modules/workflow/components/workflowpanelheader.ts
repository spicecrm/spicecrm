/**
 * @module ModuleWorkflow
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'workflow-panel-header',
    templateUrl: '../templates/workflowpanelheader.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowPanelHeader implements OnInit, OnDestroy {

    /**
     * subscroibe to the broadcast to catch when the panel issues the number
     */
    public broadcastSubscription: any = {};

    /**
     * the count recieved
     */
    public workflowcount: number = 0;

    constructor(public model: model, public backend: backend, public broadcast: broadcast, public cdref: ChangeDetectorRef) {

    }

    /**
     * on init get count and add broadcast subscription
     */
    public ngOnInit() {
        // get the count
        this.getCount();

        // subscribe to the model changes to catch a save and check if there are new workflows
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }


    /**
     * make sure on destroy to unsubscribe from the broadcast
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }

    /**
     * gets the copunt of open workflows from teh backend
     *
     * @private
     */
    private getCount(){
        this.backend.getRequest(`module/Workflows/forparent/${this.model.module}/${this.model.id}/open`).subscribe({
            next: (res) => {
                this.workflowcount = res.count;
                this.cdref.detectChanges();
            }
        });
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the one in focus
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id){
            return;
        }

        switch (message.messagetype) {
            case 'model.save':
                this.getCount();
                break;
            case 'workflows.loaded':
                this.workflowcount = message.messagedata.workflowcount;
                this.cdref.detectChanges();
                break;
        }
    }

}
