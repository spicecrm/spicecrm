/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
                private navigation: navigation,
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
        this.modellist.setListType('all', false, [], false);
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
    private handleEventClick(data: {record: ServicePlannerRecordI, event?: ServicePlannerEventI}) {
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
