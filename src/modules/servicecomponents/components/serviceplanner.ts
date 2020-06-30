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

/** @ignore */
declare var moment: any;

/**
 * Display a sheet service planner with a split view of a google maps component and a timeline component that interact with each other to help doing the service planning.
 */
@Component({
    selector: 'service-planner',
    templateUrl: './src/modules/servicecomponents/templates/serviceplanner.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ServicePlannerService, modellist, model, view]
})

export class ServicePlanner implements OnInit, OnDestroy {
    /**
     * holds the system timezone which is loaded from the session
     */
    public timeZone: string;
    /**
     * holds the focused event color
     */
    public focusColor: string = '#ffc700';
    /**
     * holds the records that will be passed to the timeline component
     */
    protected timelineRecords: ServicePlannerRecordI[] = [];
    /**
     * holds the module filters
     */
    private moduleFilters = {timelineUsers: null, timelineOrders: null, mapOrders: null};
    /**
     * subscription to handle unsubscribe
     */
    private subscriptions: Subscription = new Subscription();
    /**
     * holds the end date
     */
    private endDate: any = moment();
    /**
     * holds the start date
     */
    private startDate: any = moment();
    /**
     * holds the start date
     */
    private isLoading: boolean = false;

    constructor(private language: language,
                private cdRef: ChangeDetectorRef,
                private renderer: Renderer2,
                private broadcast: broadcast,
                private metadata: metadata,
                private navigationtab: navigationtab,
                private backend: backend,
                private session: session,
                private view: view,
                private servicePlannerService: ServicePlannerService,
                private modellist: modellist) {
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
    private initializeModelList() {
        this.modellist.usecache = false;
        // set the module in an embedded mode so not the full list is loaded
        this.modellist.setModule('ServiceOrders', true);
        this.modellist.listcomponent = 'SpiceGoogleMapsList';
        this.modellist.reLoadList(true);
    }

    /**
     * loads the module filters for the records
     */
    private loadModuleFilters() {
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
    private setTabInfo() {
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_SERVICE_PLANNER'), displayicon: 'date_input'});
    }

    /**
     * set the date range from the timeline component
     * @param dateRange
     */
    private setDateRange(dateRange) {
        this.startDate = new moment(dateRange.start.format());
        this.endDate = new moment(dateRange.end.format());
        this.getUsersServiceOrders();
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    private subscribeToChanges() {
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
                case 'model.save':
                    if (module !== 'ServiceOrders') break;
                    this.handleEventChange(data);
                    // force detect changes
                    this.timelineRecords = this.timelineRecords.slice();
                    this.modellist.reLoadList(true);
                    break;
                case 'model.delete':
                    this.timelineRecords.some((record: ServicePlannerRecordI) => {
                        if (record.id !== data.assigned_user_id) return false;
                        record.events = record.events.filter((serviceOrder: ServicePlannerEventI) => serviceOrder.id !== data.id);
                    });
                    // force detect changes
                    this.timelineRecords = this.timelineRecords.slice();
                    break;
            }
        });
        this.subscriptions.add(subscriber);
    }

    /**
     * modify event date after drop
     * @param data
     * @return boolean true if the event was found
     */
    private handleEventChange(data) {

        if (moment(data.date_start) > this.endDate && moment(data.date_end) < this.startDate) {
            this.timelineRecords.some((record: ServicePlannerRecordI) => {
                if (record.id !== data.assigned_user_id) return false;
                record.events = record.events.filter((serviceOrder: ServicePlannerEventI) => serviceOrder.id !== data.id);
                return true;
            });
        } else {
            this.timelineRecords.some((record: ServicePlannerRecordI) => {

                if (record.id !== data.assigned_user_id) return false;

                const exists = record.events.some((serviceOrder: ServicePlannerEventI) => {
                    if (serviceOrder.id !== data.id) return false;
                    serviceOrder.data = {...data};
                    serviceOrder.start = new moment(moment.utc(data.date_start).tz(this.timeZone).format());
                    serviceOrder.end = new moment(moment.utc(data.date_end).tz(this.timeZone).format());
                    return true;
                });
                if (exists) return true;

                const event: ServicePlannerEventI = {
                    id: data.id,
                    module: 'ServiceOrders',
                    start: new moment(moment.utc(data.date_start).tz(this.timeZone).format()),
                    end: new moment(moment.utc(data.date_end).tz(this.timeZone).format()),
                    data: {...data}
                };
                record.events.push(event);
                record.events.sort((a, b) => a.start.isAfter(b.start) ? 1 : -1);
                return true;
            });
        }
    }

    /**
     * load events from backend
     */
    private getUsersServiceOrders() {

        this.timelineRecords = [];
        this.isLoading = true;
        const format = "YYYY-MM-DD HH:mm:ss";
        const params = {
            start: this.startDate.format(format),
            end: this.endDate.format(format),
            timelineUsersFilter: this.moduleFilters.timelineUsers,
            timelineOrdersFilter: this.moduleFilters.timelineOrders
        };

        this.backend.getRequest('modules/ServiceOrders/Planner/records', params)
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
    private handleEventClick(event: ServicePlannerEventI) {
        this.broadcast.broadcastMessage('map.focus', {
            record: event,
            tabId: 'main'
        });
        if (this.servicePlannerService.timelineSelectedEvent) {
            this.servicePlannerService.timelineSelectedEvent.color = null;
        }
        this.servicePlannerService.timelineSelectedEvent = event;
        event.color = this.focusColor;
        // force detect changes
        this.timelineRecords = this.timelineRecords.slice();
    }
}
