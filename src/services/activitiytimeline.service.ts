/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {model} from './model.service';
import {metadata} from './metadata.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {BehaviorSubject, Observable, Subject, of} from "rxjs";

/**
 * defines the type for the modules
 */
export type activityTimeLineModules = 'Activities' | 'History';
export type activityTimelineOwnerfilter = '' | 'assigned' | 'created';

@Injectable()
export class activitiytimeline {

    /**
     * a model object of the parent record the activities are linked to
     */
    public parent: model;

    /**
     * subscriptions to be called to destroy in the destructor
     */
    public serviceSubscriptions: any[] = [];

    /**
     * an object for filters to be applied
     */
    public filters: any = {
        searchterm: '',
        objectfilters: [],
        own: ''
    };

    /**
     * a event emitter that emits if the service is reloading
     */
    public loading$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the default limit
     */
    public defaultLimit = 5;

    /**
     * the modules to be loaded. Currnetly this is activities and history
     */
    public modules: activityTimeLineModules[] = ['Activities', 'History'];

    /**
     * for sorting in new activities .. shoudl be replaced and triggered by the filter objects int he backend to keep it flexible
     */
    public activeStates: string[] = ['Planned', 'In Progress', 'Not Started', 'Pending Input'];

    /**
     * list fo teh objects the filter can be applied to if selöected from the Database
     *
     * ToDo: add the filter based on aggregates
     */
    public activityObjects: any[] = ['Tasks', 'Meetings', 'Calls', 'Notes', 'Emails'];

    /**
     * the sort dates ..
     * ToDo: not nice to handle it that way .. shoudl be done on the backend
     */
    public sortDates: any = {
        Calls: 'date_start',
        Meetings: 'date_start',
        Tasks: 'date_due',
        Emails: 'date_entered',
        Notes: 'date_entered'
    };

    /**
     * holds the timelines
     */
    public activities: any = {
        Activities: {
            loading: false,
            loadingmore: false,
            list: [],
            totalcount: 0,
            aggregates: []
        },
        History: {
            loading: false,
            loadingmore: false,
            list: [],
            totalcount: 0,
            aggregates: []
        }
    };

    /**
     * set to true to use FTS for the analysis and queries
     */
    public usefts: boolean = false;

    /**
     * a general setting for openness on the activities
     * allows toggle all open or close
     */
    public _openness: boolean = false;

    /**
     * an openness emitter any activity can subscribe to and then toggle its open states
     * emits true to open or close the activities
     */
    public openness$: BehaviorSubject<boolean>;

    constructor(public metadata: metadata, public backend: backend, public modelutilities: modelutilities, public configurationService: configurationService, public session: session, public broadcast: broadcast) {
        this.serviceSubscriptions.push(this.broadcast.message$.subscribe(message => this.handleMessage(message)));

        // create the behavious Subject
        this.openness$ = new BehaviorSubject<boolean>(this._openness);
    }

    /**
     * get the openness state
     */
    get openness() {
        return this._openness;
    }

    /**
     * set the openness state and emit the value
     *
     * @param value
     */
    set openness(value: boolean) {
        this._openness = value;
        this.openness$.next(value);
    }

    get filterObjects(): any[] {
        if (this.usefts) {
            let objects = [];
            for (let module in this.activities) {
                objects = objects.concat(this.getAggregateObjects(module));
            }
            return _.uniq(objects);
        } else {
            return this.activityObjects;
        }
    }

    public getAggregateObjects(module) {
        try {
            let aggModules = [];
            for (let aggregate of this.activities[module].aggregates.module) {
                aggModules.push(aggregate.module);
            }
            return aggModules;
        } catch (e) {
            return [];
        }
    }

    /**
     * unsubscribes from teh broadcast
     */
    public stopSubscriptions() {
        for (let subscription of this.serviceSubscriptions) {
            subscription.unsubscribe();
        }
    }

    /**
     * @ignore
     *
     * internal function to handle broacast messages
     *
     * @param message the broadcast message
     */
    public handleMessage(message: any) {
        let messageType = message.messagetype.split('.');
        if (messageType[0] === 'model') {
            // handle the message type
            switch (messageType[1]) {
                case 'merge':
                    // check if the current parent just finished a merge so we shoudl reload the activities
                    if (this.parent && message.messagedata.module == this.parent.module && message.messagedata.id == this.parent.id) {
                        this.getTimeLineData('Activities', true);
                        this.getTimeLineData('History', true);
                    }
                    break;
                case 'save':
                    // let moduledefs = this.metadata.getModuleDefs(message.messagedata.module);
                    if (this.metadata.getModuleDefs(message.messagedata.module).ftsactivities.Activities) this.getTimeLineData('Activities', true);
                    if (this.metadata.getModuleDefs(message.messagedata.module).ftsactivities.History) this.getTimeLineData('History', true);
                    break;
                case 'delete':
                    let deleted = false;
                    for (let module of this.modules) {
                        let itemIndex = this.activities[module].list.findIndex(i => i.module == message.messagedata.module && i.id == message.messagedata.id);
                        if(itemIndex >= 0){
                            this.activities[module].list.splice(itemIndex, 1);
                        }
                    }
                    break;
            }
        }
    }

    /**
     * returns if a module is active
     *
     * @param module the moduel to check for
     */
    public checkModuleActive(module) {
        return this.filters.objectfilters.length == 0 || this.filters.objectfilters.indexOf(module) >= 0;
    }

    /**
     * sets the bject filters so the module is excluded from the search
     *
     * @param module
     */
    public toggleModuleFilter(module) {
        // check if we have any module filter
        if (this.filters.objectfilters.length == 0) {
            this.filters.objectfilters = this.filterObjects;
            this.filters.objectfilters.splice(this.filters.objectfilters.indexOf(module), 1);
        } else if (this.filters.objectfilters.indexOf(module) >= 0) {
            this.filters.objectfilters.splice(this.filters.objectfilters.indexOf(module), 1);
        } else {
            this.filters.objectfilters.push(module);
            if (this.filters.objectfilters.length == this.filterObjects.length) this.filters.objectfilters = [];
        }
    }

    /**
     * reload the entries
     */
    public reload(silent: boolean = false) {
        this.loading$.emit(true);
        for (let module of this.modules) {
            this.getTimeLineData(module, silent);
        }
    }

    /**
     * the initial load
     *
     * @param module the module to load the data for
     */
    public getTimeLineData(module: activityTimeLineModules, silent: boolean = false
    ) {

        if (!silent) {
            this.activities[module].loading = true;
        }

        let body = {
            count: true,
            limit: this.defaultLimit,
            objects: JSON.stringify(this.filters.objectfilters),
            own: this.filters.own,
            searchterm: this.filters.searchterm
        };


        this.backend.postRequest('module/' + module + '/fts/' + this.parent.module + '/' + this.parent.id, {}, body).subscribe(
            (response: any) => {
                if (response) {
                    this.resetListData(module);
                    for (let item of response.items) {
                        item.data = this.modelutilities.backendModel2spice(item.module, item.data);
                    }
                    this.activities[module].list = response.items;
                    this.activities[module].totalcount = parseInt(response.totalcount, 10);
                    this.activities[module].aggregates = response.aggregates ? response.aggregates : [];
                }
                this.activities[module].loading = false;
            },
            error => {
                this.activities[module].loading = false;
            }
        );
        /*
        if (this.usefts) {
            this.backend.postRequest('module/' + module + '/fts/' + this.parent.module + '/' + this.parent.id, {}, params)
                .subscribe((response: any) => {
                    if (response) {
                        this.resetListData(module);
                        for (let item of response.items) {
                            item.data = this.modelutilities.backendModel2spice(item.module, item.data);
                        }
                        this.activities[module].list = response.items;
                        this.activities[module].totalcount = parseInt(response.totalcount, 10);
                        this.activities[module].aggregates = response.aggregates ? response.aggregates : [];
                    }
                    this.activities[module].loading = false;
                });
        } else {
            this.backend.getRequest('module/' + module + '/' + this.parent.module + '/' + this.parent.id, params)
                .subscribe((response: any) => {
                    if (response) {
                        this.resetListData(module);
                        for (let item of response.items) {
                            item.data = this.modelutilities.backendModel2spice(item.module, item.data);
                        }
                        this.activities[module].list = response.items;
                        this.activities[module].totalcount = parseInt(response.count, 10);
                        this.activities[module].aggregates = [];


                    }
                    this.activities[module].loading = false;
                });
        }
         */
    }

    /**
     * loads more data
     *
     * @param module the module to load the data for
     * @param addCount the number of additonal entries
     */
    public getMoreTimeLineData(module: activityTimeLineModules, addCount?): Observable<boolean> {

        // if we ae laoding more or cannot load more return a resolved observable
        if (!this.canLoadMore(module) || this.activities[module].loading) {
            return of(true);
        }

        let retSubject = new Subject<boolean>();

        let params = {
            start: this.activities[module].list.length,
            limit: addCount ? addCount : this.defaultLimit,
            objects: JSON.stringify(this.filters.objectfilters),
            own: this.filters.own,
            searchterm: this.filters.searchterm
        };

        this.activities[module].loadingmore = true;

        // run the request and resolve the
        this.backend.postRequest('module/' + module + '/fts/' + this.parent.module + '/' + this.parent.id, {}, params).subscribe(
            (response: any) => {
                for (let item of response.items) {
                    // transform the data
                    item.data = this.modelutilities.backendModel2spice(item.module, item.data);

                    // add it
                    this.activities[module].list.push(item);
                }

                this.activities[module].loadingmore = false;

                retSubject.next(true);
                retSubject.complete();
            },
            error => {
                this.activities[module].loadingmore = false;

                retSubject.error(error);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();

        /*
        if (this.usefts) {
            this.backend.postRequest('module/' + module + '/fts/' + this.parent.module + '/' + this.parent.id, {}, params)
                .subscribe((response: any) => {
                    for (let item of response.items) {
                        // transform the data
                        item.data = this.modelutilities.backendModel2spice(item.module, item.data);

                        // add it
                        this.activities[module].list.push(item);
                    }

                    this.activities[module].loading = false;
                });
        } else {
            this.backend.getRequest('module/' + module + '/' + this.parent.module + '/' + this.parent.id, params)
                .subscribe((response: any) => {
                    for (let item of response.items) {
                        // transform the data
                        item.data = this.modelutilities.backendModel2spice(item.module, item.data);

                        // add it
                        this.activities[module].list.push(item);
                    }

                    this.activities[module].loading = false;
                });
        }
         */
    }

    /**
     * resets the data for a n object
     * @param module the module to reset the data for
     */
    public resetListData(module: activityTimeLineModules) {
        this.activities[module] = {
            loading: false,
            loadingmore: false,
            list: [],
            totalcount: 0
            // aggregates: []
        };
    }

    /**
     * @ignore
     *
     * Helper function to check if more entroes can be loaded
     *
     * @param module the module to handle this for
     */
    public canLoadMore(module: activityTimeLineModules) {
        return this.activities[module].totalcount > this.activities[module].list.length && !this.activities[module].loadingmore;
    }

    /**
     * sorts the entires of a module
     *
     * @param module the module to sort the data for
     */
    public sortListdata(module: activityTimeLineModules) {
        this.activities[module].list.sort((a, b) => {
            let aDate = new moment(a.data[this.sortDates[a.module]]);
            let bDate = new moment(b.data[this.sortDates[b.module]]);

            return module !== 'Activities' ? aDate.isBefore(bDate) : aDate.isAfter(bDate);
        });
    }
}
