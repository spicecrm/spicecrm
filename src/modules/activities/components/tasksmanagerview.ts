/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

/**
 * a separate view on tasks that presents a tasklist and a split view with the tasks for quick task handling for the user
 */
@Component({

    templateUrl: './src/modules/activities/templates/tasksmanagerview.html',
})
export class TasksManagerView implements OnDestroy{

    /**
     * holds the subscription to the model changes
     */
    private modellistsubscribe: any = {};

    /**
     * identifies the currrent selected task that is focused
     */
    private focus: string = null;

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model, private modellist: modellist) {

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.loadList());

        this.loadList();

    }

    public ngOnDestroy(){
        this.modellistsubscribe.unsubscribe();
    }

    /**
     * loads the lost of tasks from the modellist service
     */
    private loadList(){
        this.focus = null;
        this.modellist.sortfield = 'date_due';
        this.modellist.sortdirection = 'ASC';
        this.modellist.getListData(['name', 'parent_type', 'parent_name', 'parent_id', 'date_due', 'assigned_user_name', 'assigned_user_id', 'created_by', 'created_by_name']);
    }

    /**
     * sets the selected taks
     *
     * @param id the id of the selected task. This is emitted by the underlying component
     */
    private taskSelected(id){
        this.focus = id;
    }
}