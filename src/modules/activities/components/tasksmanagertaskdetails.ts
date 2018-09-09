import {Component, ElementRef, ViewChild, ViewContainerRef, Input, OnChanges, AfterViewInit, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'tasks-manager-task-details',
    templateUrl: './src/modules/activities/templates/tasksmanagertaskdetails.html',
    host: {
        'class': 'slds-theme--shade'
    },
    providers: [model, view]
})
export class TasksManagerTaskDetails implements OnChanges, OnDestroy {

    @ViewChild('detailscontent', {read: ViewContainerRef}) detailscontent: ViewContainerRef;

    @Input() focusid: string = '';

    viewComponent: any = null;
    modelSubscription: any = null;

    constructor(private language: language, private elementRef: ElementRef, private metadata: metadata, private model: model, private broadcast: broadcast) {
        this.model.module = 'Tasks';

        // subscribe to the broadcast service
        this.modelSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        })
    }

    handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module)
            return;

        switch (message.messagetype) {
            case 'model.delete':
                // what to do then ...
                break;
            case 'model.save':
                if (this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }

    ngOnChanges() {
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

    ngOnDestroy(){
        this.modelSubscription.unsubscribe();
    }

    get nameStyle(){
        let styles = {};

        if(this.isCompleted)
            styles['text-decoration'] = 'line-through';

        return styles;
    }

    get isCompleted() {
        return this.model.data.status == 'Completed';
    }

    get canEdit() {
        try {
            return this.model.data.acl.edit;
        } catch (e) {
            return false;
        }
    }

    completeTask() {
        this.model.data.status = 'Completed';
        this.model.save();
    }

}