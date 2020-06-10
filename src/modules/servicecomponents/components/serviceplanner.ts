/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modellist} from "../../../services/modellist.service";
import {broadcast} from "../../../services/broadcast.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display a sheet service planner with a split view of a google maps component and a timeline component that interact with each other to help doing the service planning.
 */
@Component({
    selector: 'service-planner',
    templateUrl: './src/modules/servicecomponents/templates/serviceplanner.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modellist]
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

    constructor(private language: language,
                private cdRef: ChangeDetectorRef,
                private renderer: Renderer2,
                private broadcast: broadcast,
                private metadata: metadata,
                private backend: backend,
                private modellist: modellist) {
        this.subscribeToChanges();
    }

    /**
     * the set model list module
     * get the users module filter from the component config
     */
    public ngOnInit() {
        this.modellist.module = 'ServiceOrders';
        const config = this.metadata.getComponentConfig('', this.modellist.module);
        this.usersModuleFilter = config && !!config.modulefilter ? config.modulefilter : undefined;
        this.setDateRange();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * set date range
     */
    private setDateRange() {
        this.startDate = new moment().hours(this.startHour).minutes(0);
        this.endDate = new moment().add(this.endHour, 'hours');
        this.getUsersEvents();
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
    private getUsersEvents() {

        const format = "YYYY-MM-DD HH:mm:ss";
        const params = {
            start: this.startDate.tz('utc').format(format),
            end: this.endDate.tz('utc').format(format),
            usersModuleFilter: this.usersModuleFilter
        };

        this.backend.getRequest('module/ServiceOrders/Planner/records', params).subscribe(events => {
            window.console.log(events);
        });
    }
}
