/**
 * @module ServiceComponentsModule
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modellist} from "../../../services/modellist.service";
import {broadcast} from "../../../services/broadcast.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {session} from "../../../services/session.service";
import {view} from "../../../services/view.service";
import {map} from "rxjs/operators";
import {ServicePlannerEventI, ServicePlannerRecordI} from "../interfaces/servicecomponents.interfaces";
import {ServicePlannerService} from "../services/serviceplanner.service";
import {navigation} from "../../../services/navigation.service";

/** @ignore */
declare var moment: any;

/**
 * Display a sheet service planner with a split view of a google maps component and a timeline component that interact with each other to help doing the service planning.
 */
@Component({
    selector: 'service-planner',
    templateUrl: '../templates/serviceplanner.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ServicePlannerService, modellist, model, view]
})

export class ServicePlanner implements OnInit, OnDestroy {
    /**
     * holds the system timezone which is loaded from the session
     */
    public timeZone: string;
    /**
     * holds the records that will be passed to the timeline component
     */
    public timelineRecords: ServicePlannerRecordI[] = [];
    /**
     * holds the module filters
     */
    public moduleFilters = {timelineUsers: null, timelineOrders: null, mapOrders: null};
    /**
     * subscription to handle unsubscribe
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * holds the end date
     */
    public endDate: any = moment();
    /**
     * holds the start date
     */
    public startDate: any = moment();
    /**
     * holds the start date
     */
    public isLoading: boolean = false;

    constructor(public language: language,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2,
                public broadcast: broadcast,
                public metadata: metadata,
                public navigationtab: navigationtab,
                public backend: backend,
                public session: session,
                public navigation: navigation,
                public view: view,
                public servicePlannerService: ServicePlannerService,
                public modellist: modellist) {
        this.subscribeToChanges();
        this.setTabInfo();
        this.view.displayLabels = false;
    }

    /**
     * the set model list module
     * get the users module filter from the component config
     */
    public ngOnInit() {
        this.loadModuleFilters();
        this.timeZone = this.session.getSessionData('timezone') || moment.tz.guess();
        this.initializeModelList();
    }

    /**
     * set the module for the module list service and disable cache
     */
    public initializeModelList() {
        // set the module in an embedded mode so not the full list is loaded
        this.modellist.initialize('ServiceOrders', 'SpiceGoogleMapsList');
        this.modellist.getListData();
    }

    /**
     * loads the module filters for the records
     */
    public loadModuleFilters() {
        const config = this.metadata.getComponentConfig('ServicePlanner', 'ServiceOrders');
        if (!config) return;
        this.moduleFilters.timelineUsers = !config.timelineUsersFilter ? null : config.timelineUsersFilter;
        this.moduleFilters.timelineOrders = !config.timelineOrdersFilter ? null : config.timelineOrdersFilter;
        this.moduleFilters.mapOrders = !config.mapOrdersFilter ? null : config.mapOrdersFilter;
        this.modellist.modulefilter = this.moduleFilters.mapOrders;
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the navigation tab info
     */
    public setTabInfo() {
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_SERVICE_PLANNER'), displayicon: 'date_input'});
    }

    /**
     * set the date range from the timeline component
     * @param dateRange
     */
    public setDateRange(dateRange) {
        this.startDate = new moment(dateRange.start.format());
        this.endDate = new moment(dateRange.end.format());
        this.getUsersServiceOrders();
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    public subscribeToChanges() {
        let subscriber = this.broadcast.message$.subscribe(message => {
            const module = message.messagedata.module;
            const data = message.messagedata.data;

            switch (message.messagetype) {
                case 'timezone.changed':
                    this.timeZone = message.messagedata;
                    this.timelineRecords = this.timelineRecords.map(record => {
                        record.events = record.events.map(serviceOrder => {
                            serviceOrder.start = serviceOrder.start.tz(this.timeZone);
                            serviceOrder.end = serviceOrder.end.tz(this.timeZone);
                            return serviceOrder;
                        });
                        return record;
                    });
                    this.cdRef.detectChanges();
                    break;
                case 'model.delete':
                case 'model.save':
                    if (module !== 'ServiceOrders') break;
                    this.getUsersServiceOrders();
                    this.modellist.reLoadList(true);
            }
        });
        this.subscriptions.add(subscriber);
    }

    /**
     * load events from backend
     */
    public getUsersServiceOrders() {

        this.timelineRecords = [];
        this.isLoading = true;
        const format = "YYYY-MM-DD HH:mm:ss";
        const params = {
            start: this.startDate.format(format),
            end: this.endDate.format(format),
            timelineUsersFilter: this.moduleFilters.timelineUsers,
            timelineOrdersFilter: this.moduleFilters.timelineOrders
        };

        this.backend.getRequest('module/ServiceOrders/Planner/records', params)
            .pipe(
                map((records: ServicePlannerRecordI[]) => records.map((record: ServicePlannerRecordI) => {
                        record.events = record.events.map((serviceOrder: ServicePlannerEventI) => {
                            serviceOrder.start = new moment(moment.utc(serviceOrder.start).tz(this.timeZone).format());
                            serviceOrder.end = new moment(moment.utc(serviceOrder.end).tz(this.timeZone).format());
                            return serviceOrder;
                        });
                        return record;
                    })
                )
            ).subscribe((records: ServicePlannerRecordI[]) => {
                this.timelineRecords = records;
                this.isLoading = false;
                this.cdRef.detectChanges();
            },
            () => {
                this.isLoading = false;
                this.cdRef.detectChanges();
            });
    }

    /**
     * handle the event click
     * @param event
     */
    public handleEventClick(data: {record: ServicePlannerRecordI, event?: ServicePlannerEventI}) {
        // defocus the map
        this.broadcast.broadcastMessage('map.defocus', {tabId: this.navigation.activeTabObject.id, record: {}});

        // focus the map
        const selected = this.servicePlannerService.timelineSelectedItem;

        if (!!data.event && (!selected || (!selected.event || (!!selected.event && data.event.id != selected.event.id)))) {
            this.broadcast.broadcastMessage('map.focus', {
                record: data.event,
                tabId: this.navigation.activeTabObject.id
            });
        }

        // set the selected item
        if (!!selected) {
            if (selected.event) this.servicePlannerService.timelineSelectedItem.event.color = null;
            if ((selected.record.id == data.record.id && !data.event && !selected.event) || (!!data.event && !!selected.event && data.event.id == selected.event.id)) {
                this.servicePlannerService.timelineSelectedItem = undefined;
            } else {
                this.servicePlannerService.timelineSelectedItem = data;
            }
        } else {
            this.servicePlannerService.timelineSelectedItem = data;
        }

        // force detect changes
        this.timelineRecords = this.timelineRecords.slice();
    }
}
