/**
 * @module ServiceComponentsModule
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modellist} from "../../../services/modellist.service";
import {broadcast} from "../../../services/broadcast.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {session} from "../../../services/session.service";

/** @ignore */
declare var moment: any;

/**
 * Display a sheet service planner with a split view of a google maps component and a timeline component that interact with each other to help doing the service planning.
 */
@Component({
    selector: 'service-planner',
    templateUrl: './src/modules/servicecomponents/templates/serviceplanner.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modellist, model]
})

export class ServicePlanner implements OnInit, OnDestroy {
    /**
     * holds the records that will be passed to the timeline component
     */
    protected timelineRecords: any[] = [];
    /**
     * holds the start hour from user preferences
     */
    private startHour: number = 0;
    /**
     * holds the end hour from user preferences
     */
    private endHour: number = 23;
    /**
     * holds the users module filter
     */
    private usersModuleFilter: string;
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
     * holds the system timezone which is loaded from the session
     */
    public timeZone: any;

    constructor(private language: language,
                private cdRef: ChangeDetectorRef,
                private renderer: Renderer2,
                private broadcast: broadcast,
                private metadata: metadata,
                private navigationtab: navigationtab,
                private backend: backend,
                private session: session,
                private modellist: modellist) {
        this.subscribeToChanges();
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_SERVICE_PLANNER'), displayicon: 'date_input'});
    }

    /**
     * the set model list module
     * get the users module filter from the component config
     */
    public ngOnInit() {
        this.modellist.module = 'ServiceOrders';
        this.timeZone = this.session.getSessionData('timezone') || moment.tz.guess();
        const config = this.metadata.getComponentConfig('', this.modellist.module);
        this.usersModuleFilter = config && !!config.modulefilter ? config.modulefilter : undefined;
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the date range from the timeline component
     * @param dateRange
     */
    private setDateRange(dateRange) {
        this.startDate = new moment(dateRange.start);
        this.endDate = new moment(dateRange.end);
        this.getUsersServiceOrders();
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    private subscribeToChanges() {
        let subscriber = this.broadcast.message$.subscribe(message => {
            const id = message.messagedata.id;
            const module = message.messagedata.module;
            const data = message.messagedata.data;

            if (module == 'ServiceOrders') {
                switch (message.messagetype) {
                    case "model.save":

                        break;
                }
            }
        });
        this.subscriptions.add(subscriber);
    }

    /**
     * load events from backend
     */
    private getUsersServiceOrders() {

        const format = "YYYY-MM-DD HH:mm:ss";
        const params = {
            start: this.startDate.tz('utc').format(format),
            end: this.endDate.tz('utc').format(format),
            usersModuleFilter: this.usersModuleFilter
        };

        this.backend.getRequest('modules/ServiceOrders/Planner/records', params).subscribe(records => {
            this.timelineRecords = records.map(record => {
                record.events = record.serviceOrders.map(order => {
                    order.start = moment.utc(order.start).tz(this.timeZone);
                    order.end = moment.utc(order.end).tz(this.timeZone);
                    return order;
                });
                return record;
            });
        });
    }
}
