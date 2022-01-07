/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {ListTypeI} from "../../../services/interfaces.service";

/**
 * a separate view on tasks that presents a tasklist and a split view with the tasks for quick task handling for the user
 */
@Component({

    templateUrl: '../templates/tasksmanagerview.html',
})
export class TasksManagerView implements OnDestroy {

    /**
     * holds the subscription to the model changes
     */
    public modellistsubscribe: any = {};

    /**
     * identifies the currrent selected task that is focused
     */
    public focus: string = null;

    constructor(public broadcast: broadcast, public navigation: navigation, public elementRef: ElementRef, public model: model, public modellist: modellist) {

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listType$.subscribe(newType =>
            this.handleListTypeChange(newType)
        );

        this.loadList();

    }

    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    public handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'TasksManagerView') return;
        this.loadList();
    }

    /**
     * loads the lost of tasks from the modellist service
     */
    public loadList() {
        this.focus = null;
        this.modellist.setSortField('date_due', 'ASC');
        this.modellist.getListData();
    }

    /**
     * sets the selected taks
     *
     * @param id the id of the selected task. This is emitted by the underlying component
     */
    public taskSelected(id) {
        this.focus = id;
    }
}
