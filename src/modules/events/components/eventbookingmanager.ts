import {Component, OnInit, SkipSelf, ViewChild} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {EventBookingTable} from './eventbookingtable';
import { take } from 'rxjs/operators';
import {Subscription} from "rxjs";

@Component({
    selector: 'event-booking-manager',
    templateUrl : '../templates/eventbookingmanager.html',
    providers: [relatedmodels, view, model]
})

export class EventBookingManager implements OnInit {

    public isLoaded: boolean = false;

    /**
     * event and eventcapacitytypes with all their capacities
     */
    public eventData: any = {};

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * the index of the active tab
     */
    public activeTab: number = 0;

    public allowOverflow: boolean = false;

    /**
     * holds which tabs have been activated. Since they are only rendered when clicked or set to forcerender
     */
    public activatedTabs: number[] = [0];

    /**
     * fieldset rendered in box
     */
    public fieldset: any = {};

    @ViewChild(EventBookingTable) table:EventBookingTable;

    public subscription: Subscription = new Subscription();

    constructor(
                public relatedmodels: relatedmodels,
                @SkipSelf() public model: model,
                public activeCapacityType: model,
                public metadata: metadata,
                public view: view,
                public language: language,
                public toast: toast,
                public backend: backend) {}

    public ngOnInit() {
        if ( this.model.id ) this.init();
        else this.model.data$.pipe(take(1)).subscribe( () => this.init() );
    }

    public init() {
        this.getRelatedData();
        this.view.isEditable = true;
        this.allowOverflow = this.componentconfig.allowOverflow;
        this.doBookable();
        this.subscription.add(
            this.model.field$.subscribe( ( data ) => {
                if ( data.field === 'status' ) this.doBookable(data.value)
            })
        );
    }

    public doBookable(eventStatus=null): void
    {
        if ( eventStatus === null ) eventStatus = this.model.getField('status');
        const isBookable = ( eventStatus === 'released' || eventStatus === 'active' || eventStatus === 'complete' );
        if ( isBookable && !this.view.isEditMode() ) this.view.setEditMode();
        if ( !isBookable && this.view.isEditMode() ) this.view.setViewMode();
    }

    /**
     * get all capacities related to event
     */
    public getRelatedData() {
        this.isLoaded = false;

        let route = 'module/Events/' + this.model.id + '/bookingtable';

        // if parent is an EventCapacity, use this route to get only this capacity
        if(this.model.module == 'EventCapacities') {
            route = 'module/EventCapacities/' + this.model.id + '/bookingtable';
        }

        this.subscription.add(
            this.backend.getRequest(route).subscribe(res => {
                if(res.status == 'success') {
                    this.eventData = res.data;

                    if(this.eventData.capacityTypes.length > 0) {
                        this.setActiveCapacityType(this.eventData.capacityTypes[this.activeTab]);
                    }

                    this.isLoaded = true;
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR_LOADING_RECORD'), 'error');
                }
            })
        );
    }

    /**
     * reset and reload data
     */
    public reload() {
        this.resetData();
        this.getRelatedData();
    }

    /**
     * reset and reload data
     */
    public showOverflow() {
        this.allowOverflow = !this.allowOverflow;
        this.table?.renderTable(this.activeCapacityType.getFieldValue('tableData'));
    }

    /**
     * reset data
     */
    public resetData() {
        this.relatedmodels.resetData();
        this.activatedTabs = [];
        this.eventData = [];
    }

    /**
     * chanmge teh active tab and render it
     * @param index
     * @param capacity
     */
    public setActiveTab(index, capacityType) {
        this.activatedTabs.push(index);
        this.activeTab = index;

        this.setActiveCapacityType(capacityType);
    }

    /**
     * initialize the active capacity and set data from relatedmodels
     * @param capacitytype
     */
    public setActiveCapacityType( capacityType ) {
        this.activeCapacityType.module = 'EventCapacityTypes';
        this.activeCapacityType.id = capacityType.id;
        this.activeCapacityType.initialize();
        this.activeCapacityType.setField('tableData', capacityType);
        this.table?.renderTable(this.activeCapacityType.getFieldValue('tableData'));
    }

    /**
     * returns if the item is hidden
     * @param itemconfig
     */
    public isHidden(itemconfig){
        // check that we have acl access
        if(itemconfig.acl && this.model.checkAccess(itemconfig.acl)) return true;

        // check that we have mode state access
        if(itemconfig.requiredmodelstate && !this.model.checkModelState(itemconfig.requiredmodelstate)) return true;

        return false;
    }

    /**
     * checks if the tab is to be rendered or forced to be rendered. If not is will be (by ngIf only be rendered when the tab is selected
     * @param tabindex
     */
    public checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.eventData.capacityTypes && this.eventData.capacityTypes[tabindex].forcerender);
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
