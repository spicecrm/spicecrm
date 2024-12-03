/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";
import {view} from "../../../services/view.service";

/**
 * a separate view on tasks that presents a tasklist and a split view with the tasks for quick task handling for the user
 */
@Component({
    selector: 'spice-imports-view',
    templateUrl: '../templates/spiceimportsview.html',
    providers: [view]
})
export class SpiceImportsView implements OnInit, OnDestroy {

    /**
     * holds the subscription to the model changes
     */
    public modellistsubscribe: Subscription = new Subscription();

    /**
     * the module that has been imported
     */
    public selectedModule: string;

    /**
     * the selected ID
     */
    public selectedID: string;

    /**
     * the status of the selected item
     */
    public selectedStatus: string;

    constructor(public broadcast: broadcast, public navigation: navigation, public elementRef: ElementRef, public model: model, public modellist: modellist, public view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        // subscribe to changes of the listtype
        this.modellistsubscribe.add(
            this.modellist.listType$.subscribe(newType => this.handleListTypeChange(newType))
        );
        this.modellistsubscribe.add(
            this. modellist.selectionChanged$.subscribe(data =>  this.setSelected())
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

    private setSelected() {
        let selected = this.modellist.listData.list.find(i => i.selected);
        if(selected) {
            this.selectedID = selected.id;
            this.selectedStatus = selected.status;
            this.selectedModule = selected.module
        } else {
            this.selectedID = undefined;
            this.selectedStatus = undefined;
            this.selectedModule = undefined;
        }
    }

    /**
     * loads the lost of tasks from the modellist service
     */
    public loadList() {
        this.modellist.setSortField('date_entered', 'DESC');
        this.modellist.getListData();
    }

}
