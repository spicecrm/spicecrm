/**
 * @module ModuleActivities
 */
import {
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';

/**
 * displays a task in the task manager view
 *
 * ToDo: change to fieldset in the header
 */
@Component({
    selector: 'tasks-manager-task-details',
    templateUrl: '../templates/tasksmanagertaskdetails.html',
    host: {
        class: 'slds-theme--shade'
    },
    providers: [model, view]
})
export class TasksManagerTaskDetails implements OnChanges, OnDestroy {

    @ViewChild('detailscontent', {read: ViewContainerRef, static: true}) public detailscontent: ViewContainerRef;

    /**
     * to set the focus
     */
    @Input() public focusid: string = '';

    public viewComponent: any = null;
    public modelSubscription: any = null;

    constructor(public view: view, public language: language, public elementRef: ElementRef, public metadata: metadata, public model: model, public broadcast: broadcast) {
        this.model.module = 'Tasks';

        // subscribe to the broadcast service
        this.modelSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        this.view.displayLabels = false;
    }

    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module)  return;

        switch (message.messagetype) {
            case 'model.delete':
                // what to do then ...
                break;
            case 'model.save':
                if (this.model.id === message.messagedata.id) {
                    this.model.setData(message.messagedata.data, false);
                }
                break;
        }
    }

    public ngOnChanges() {
        // set or delete the component
        if (this.focusid) {
            if (!this.viewComponent) {
                this.metadata.addComponent('ObjectRecordDetails', this.detailscontent).subscribe(component => {
                    this.viewComponent = component;
                })
            }
        } else {
            if (this.viewComponent) {
                this.viewComponent.destroy();
                this.viewComponent = null;
            }
        }

        if (this.focusid && this.focusid != this.model.id) {
            this.model.id = this.focusid;
            this.model.getData();
        }
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    get nameStyle() {
        let styles = {};

        if (this.isCompleted){
            styles['text-decoration'] = 'line-through';
        }

        return styles;
    }

    get isCompleted() {
        return this.model.getField('status') == 'Completed';
    }

    get canEdit() {
        try {
            return this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }

    public completeTask() {
        this.model.setField('status', 'Completed');
        this.model.save();
    }
}
