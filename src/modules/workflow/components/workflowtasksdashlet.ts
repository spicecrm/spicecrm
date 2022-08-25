/**
 * @module ModuleWorkflow
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {broadcast} from '../../../services/broadcast.service';
import {modelutilities} from '../../../services/modelutilities.service';

declare var moment: any;

/**
 * renders a dashlet with open Workflow Tasks for the user
 */
@Component({
    selector: 'workflow-taks-dashlet',
    templateUrl: '../templates/workflowtasksdashlet.html',
    providers: [model],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class WorkflowTasksDashlet {

    /**
     * the container refgerence .. for the setting of the dimensions
     */
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) public itemcontainer: ViewContainerRef;

    /**
     * the tasks to be rendered
     */
    public workflowtasks: any[] = [];

    public loading: boolean = false;

    constructor(public model: model, public modelutilities: modelutilities, public session: session, public backend: backend, public broadcast: broadcast, public elementref: ElementRef) {
        this.loadWorkflows();

        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public loadWorkflows(){
        this.workflowtasks = [];
        this.loading = true;
        this.backend.getRequest('module/Workflows/mytasks').subscribe({
            next: (wftasks) => {
                for (let wftask of wftasks) {
                    this.workflowtasks.push(this.modelutilities.backendModel2spice('WorkflowTasks', wftask));
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }


    /**
     * handles the broadcast message
     *
     * @param message
     */
    public handleMessage(message: any) {
        if (message.messagedata.module != 'WorkflowTasks') return;

        let wfi = this.workflowtasks.findIndex(wt => wt.id == message.messagedata.id);
        switch (message.messagetype) {
            case 'model.delete':
                // see if we have the task listed and remove it
                if(wfi >= 0) this.workflowtasks.splice(wfi, 1);
                break;
            case 'model.save':
                if(wfi >= 0){
                    if(parseInt(message.messagedata.data.workflowtask_status, 10) >= 30){
                        this.workflowtasks.splice(wfi, 1);
                    } else {
                        this.workflowtasks[wfi].workflowtask_status = message.messagedata.data.workflowtask_status;
                    }
                } else {
                    this.loadWorkflows();
                }
                break;
        }
    }


    /**
     * gets and sets the style for the dashlet
     */
    get containerStyle() {
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.itemcontainer.element.nativeElement.offsetTop + 'px)'
        };
    }

    /**
     * returns ture if the date is today / day based
     */
    public isToday(date) {
        let today = new moment.utc().tz(this.session.getSessionData('timezone'));
        return new moment.utc(date).tz(this.session.getSessionData('timezone')).isSame(today, 'day');
    }

    /**
     * returns ture if the date is in treh past / day based
     */
    public isPast(date) {
        let today = new moment.utc().tz(this.session.getSessionData('timezone'));
        return  new moment.utc(date).tz(this.session.getSessionData('timezone')).isBefore(today, 'day');
    }
}
