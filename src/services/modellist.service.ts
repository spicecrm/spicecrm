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
 * @module services
 */
import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, of, BehaviorSubject} from 'rxjs';
import {backend} from './backend.service';
import {userpreferences} from './userpreferences.service';
import {language} from './language.service';
import {metadata} from "./metadata.service";
import {broadcast} from "./broadcast.service";
import {session} from "./session.service";
import {configurationService} from "./configuration.service";
import {toast} from "./toast.service";

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

interface geoSearch {
    radius: number;
    lat: number;
    lng: number;
}

/**
 * refines an interface for the relate filter
 * this can be used to limit results to relationships
 */
export interface relateFilter {
    module: string;
    relationship: string;
    id: string;
    display: string;
    active: boolean;
    required: boolean;
}

@Injectable()
export class modellist implements OnDestroy {

    /**
     * the module the list is for
     */
    public _module: string = '';

    /**
     * an optional modulefilter
     */
    public modulefilter: string;

    /**
     * a relatefilter
     */
    public relatefilter: relateFilter;

    /**
     * a behavioural subject to catch the list data loads
     */
    public listDataChanged$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * an optional bean for modulefilter (parent-bean over the list)
     * is given to the custom filter methods
     */
    public filtercontextbeanid: string;

    /**
     * a behavioural subject for the listtype to catch changes in other components
     */
    public listtype$: BehaviorSubject<string>;

    /**
     * the list data
     */
    public listData: any = {
        list: [],
        totalcount: 0,
        source: undefined,
        listcomponent: undefined
    };

    /**
     * the selected items
     */
    public listSelected: any = {
        type: '',
        items: []
    };

    /**
     * emits when the selection of the list has been changed via select all .. to trigger chanmge detection on the components
     */
    public selectionChanged$: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * keeps the last retrieved fields
     * ToDo: check if keep that
     */
    public lastFields: any[] = [];

    /**
     * holds an array of fields and direction for multidimensional sorting
     */
    public sortArray: any[] = [];

    /**
     * keeps the last loaded date
     */
    public lastLoad: any = new moment();

    /**
     * the limit for loading the list
     */
    public loadlimit: number = 50;

    /**
     * an indicator that the list is loading
     */
    public isLoading: boolean = false;

    // public searchConditions: any[] = [];

    /**
     * the search term
     */
    public searchTerm: string = '';

    /**
     * holds the aggregates for the module
     */
    public moduleAggregates: any[] = [];

    /**
     * the set search aggregates as returned by the search
     */
    public searchAggregates: any;

    /**
     * the aggregate values the user selected
     */
    public selectedAggregates: string[] = [];

    /**
     * search geo data
     */
    public searchGeo: geoSearch;

    /**
     * for the bucketed views
     */
    public buckets: any = {};

    /**
     * set to true if the data when retrieved should be cached in the session
     */
    public usecache: boolean = true;

    /**
     * the default lists any module has
     */
    public standardLists: any[] = [
        {
            id: 'all',
            type: 'all',
            name: '<LBL_ALL> <module>',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }, {
            id: 'owner',
            type: 'owner',
            name: '<LBL_MY> <module>',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }
    ];

    /**
     * the available list types for the module
     *
     * ToDo ... decide if we need them here at all or just keep them on the metadata service where they belong
     */
    public listTypes: any[] = [];

    /**
     * the current seletced list
     */
    public currentList: any = {};

    /**
     * the listcomponent used to render the list
     */
    public _listcomponent: string = 'ObjectList';

    /**
     * an eventemitter for the listcompoonent
     */
    public listcomponent$: BehaviorSubject<any>;

    /**
     * any other service that is subscribed .. to ensure we unsubscribe on destroy
     */
    public serviceSubscriptions: any[] = [];

    /**
     * to help navigation set to display the aggregates
     */
    public displayAggregates: boolean = false;

    /**
     * to help navigation set to display the filters
     */
    public displayFilters: boolean = false;

    /**
     * a relaod timeout .. set when the sort is changed to reacxt to subsequent changes and not relaod immediately
     */
    private reloadTimeOut: any;

    /**
     * holds the listfields .. supports the regular list service where fields can be selected
     */
    public _listfields: any[] = [];

    /**
     * an emitter when the listfields have been updated
     */
    public listfield$: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private broadcast: broadcast,
        private backend: backend,
        // private fts: fts,
        private metadata: metadata,
        private language: language,
        private userpreferences: userpreferences,
        private session: session,
        private configuration: configurationService,
        private toast: toast
    ) {
        // create the event behaviour Subject
        this.listtype$ = new BehaviorSubject<string>('all');

        // emit the list component
        this.listcomponent$ = new BehaviorSubject<any>(this._listcomponent);

        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    /**
     * simple getter for the module
     */
    get module() {
        return this._module;
    }

    /**
     * setter for the module to also trigger the key aspects that need to happen when the module is changed
     *
     * @param module
     */
    set module(module: string) {
        this.setModule(module);
    }

    /**
     * sets the mopdule
     *
     * @param module the module
     * @param embedded set to true if the listservice is run embedded ina  component and setting listtype etc is not needed, this is used e.g. when used in builöt in lists
     */
    public setModule(module: string, embedded: boolean = false) {
        // check if the module has changed
        if (!this._module || this._module != module) {
            // set the module internally
            this._module = module;

            // reset the list data
            this.resetListData();

            // set the aggergates for the module
            this.moduleAggregates = [];
            for (let moduleAggregate of this.metadata.getModuleAggregates(module)) {
                this.moduleAggregates.push({...moduleAggregate});
            }
            this.moduleAggregates.sort((a, b) => {
                if (!a.priority && !b.priority) return 0;
                return (!a.priority || a.priority > b.priority) ? 1 : -1;
            });

            // load the list types for the module
            this.loadListTypes();

            // if we are in embedded mode stop processing and return
            if(embedded) return;

            // try to get the list data from the session if there is session data stored
            if (!this.getFromSession()) {
                // try to get a default list type
                let modulepreferences = this.userpreferences.getPreference(module);
                if (modulepreferences && modulepreferences.lastlisttype && this.listtypeexists(modulepreferences.lastlisttype)) {
                    this.setListType(modulepreferences.lastlisttype, false);
                } else {
                    this.setListType('all', false);
                }
            } else {
                // reload quite if we did retrive from cache
                this.reLoadList(true);
            }


        }
    }

    /**
     * the current list type
     */
    get listtype() {
        return this.currentList.id;
    }


    /**
     * handles model updates
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.module) {
            return;
        }

        switch (message.messagetype) {
            case 'model.delete':
                let deletedItemIndex = this.listData.list.findIndex(item => item.id == message.messagedata.id);
                if (deletedItemIndex >= 0) {
                    this.listData.list.splice(deletedItemIndex, 1);
                    this.listData.totalcount--;

                    // analyse if we need to update the buckets
                    if (this.bucketfield) {
                        let bucketamountfields = [];
                        for (let bucketamountfield of this.bucketamountfield) {
                            bucketamountfields.push({
                                fieldname: bucketamountfield.name,
                                value: message.messagedata.data[bucketamountfield.name],
                            });
                        }

                        this.removeItemFromBucket(message.messagedata.data[this.bucketfield], bucketamountfields);
                    }
                }
                this.listDataChanged$.next(true);

                break;
            case 'model.save':
                let eventHandled = false;
                let savedItemIndex = this.listData.list.findIndex(item => item.id == message.messagedata.id);
                if (savedItemIndex >= 0) {
                    this.listData.list[savedItemIndex] = message.messagedata.data;

                    // analyse if we need to update the buckets
                    if (this.bucketfield) {
                        if (message.messagedata.changed[this.bucketfield]) {
                            // update the bucket and if an amount is set snd in also the changed amount

                            let bucketamountfields = [];
                            for (let bucketamountfield of this.bucketamountfield) {
                                bucketamountfields.push({
                                    fieldname: bucketamountfield.name,
                                    valuefrom: message.messagedata.backupdata[bucketamountfield.name],
                                    valueto: message.messagedata.data[bucketamountfield.name],
                                });
                            }

                            this.updateBuckets(
                                message.messagedata.backupdata[this.bucketfield],
                                message.messagedata.data[this.bucketfield],
                                bucketamountfields
                            );
                        } else if (this.bucketamountfield) {
                            // just update the amount fields
                            let bucket = this.buckets.bucketitems.find(bucket => bucket.bucket == message.messagedata.data[this.bucketfield]);
                            for (let bucketamountfield of this.bucketamountfield) {
                                if (message.messagedata.changed[bucketamountfield.name]) {
                                    bucket.values['_bucket_agg_' + bucketamountfield.name] += message.messagedata.data[bucketamountfield.name] - message.messagedata.backupdata[bucketamountfield.name];
                                }
                            }

                        }
                    }
                    this.listDataChanged$.next(true);

                } else {
                    this.reLoadList();
                }
                break;
        }
    }

    public ngOnDestroy() {
        // unsubscribe from broadcast
        for (let serviceSubscription of this.serviceSubscriptions) {
            serviceSubscription.unsubscribe();
        }
    }


    /**
     * loads the list types from the metadata service
     */
    private loadListTypes() {
        // get the custom listtypes
        this.listTypes = [];
        for (let listtype of this.metadata.getModuleListTypes(this.module)) {
            this.listTypes.push(listtype);
        }
    }

    /**
     * simple getter for the listcomponent
     */
    get listcomponent() {
        return this._listcomponent ? this._listcomponent : 'ObjectList';
    }

    /**
     * setter fo the listcomponent that also emits the component via hte behaviour subject
     *
     * @param listcomponent
     */
    set listcomponent(listcomponent) {
        if(this._listcomponent != listcomponent) {
            this._listcomponent = listcomponent;
            this.listcomponent$.next(listcomponent);

            // set it to the preferences when we are on a general list
            if (this.currentList.id == 'all' || this.currentList.id == 'owner') {
                this.userpreferences.setPreference('defaultlisttype', listcomponent, false, this.module);
            }

            // reset current list fielddefs and redetermine its fields from the component config

            this.determineListFields();
        }
    }

    /**
     * sets a field as sort criteria
     *
     * @param field the field
     * @param sortDirection optional the sort direction
     * @param reload an indicator if the list shoudl reload automatically
     */
    public setSortField(field: string, sortDirection?: 'ASC' | 'DESC', reload = true) {
        // check that a field is set and that the list is not right now loading
        if (!field || this.isLoading) return;

        // find the field we are sorting an and if found handle the sort
        let sortItemIndex = this.sortArray.findIndex(item => item.sortfield == field);
        if (sortItemIndex >= 0) {
            let sortItem = this.sortArray[sortItemIndex];
            if (sortItem.sortdirection == 'ASC') {
                sortItem.sortdirection = 'DESC';
            } else {
                this.sortArray.splice(sortItemIndex, 1);
            }
        } else {
            this.sortArray.push({
                sortfield: field,
                sortdirection: sortDirection ? sortDirection : 'ASC'
            });
        }

        // reload with a lsight delay
        if (reload) {
            if (this.reloadTimeOut) window.clearTimeout(this.reloadTimeOut);
            this.reloadTimeOut = window.setTimeout(() => this.reLoadList(), 500);
        }
    }

    /**
     * returns the sort par<mater for a specific field if it is a current sort criteria
     * @param field
     */
    public getSortField(field) {
        let sortItemIndex = this.sortArray.findIndex(item => item.sortfield == field);
        if (sortItemIndex >= 0) {
            let sortItem = this.sortArray[sortItemIndex];
            return {
                sortdirection: sortItem.sortdirection,
                sortindex: sortItemIndex,
                sortitems: this.sortArray.length
            };
        }

        return false;
    }

    /**
     * returns an array of sort fields to be displays
     */
    public getSortFields() {
        let sortfields = [];
        for (let sortitem of this.sortArray) {
            sortfields.push(this.language.getFieldDisplayName(this.module, sortitem.sortfield));
        }
        return sortfields.join(', ');
    }

    /**
     * simplegetter that returns if there are sort fields set
     */
    get isSorted() {
        return this.sortArray.length > 0;
    }

    public addCustomListtype(id, name, fielddefs, filterdefs, global): void {
        this.listTypes.push({
            id: id,
            name: name,
            global: global,
            fielddefs: fielddefs,
            filterdefs: filterdefs
        });
    }

    /**
     * checks if the listtype exists
     *
     * @param listType
     */
    private listtypeexists(listType: string) {
        return this.getListTypes().find(lt => lt.id == listType) ? true : false;
    }

    /**
     * sets the listtype and also sets it to the preferences
     *
     * @param listType
     * @param setPreference
     */
    public setListType(listType: string, setPreference = true, sortArray = [], loadlist: boolean = true): void {

        // close filters and aggegarts if they are being displayed
        this.displayAggregates = false;
        this.displayFilters = false;

        // set the listtype
        // this.listtype = listType;
        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                this.currentList = thisListType;
            }
        }

        // determine the listfields
        this.determineListFields(listType);

        // set the user preferences
        if (setPreference) {
            let modulepreferences = this.userpreferences.getPreference(this.module);
            if (!modulepreferences) {
                modulepreferences = {};
            }
            modulepreferences.lastlisttype = listType;
            this.userpreferences.setPreference(this.module, modulepreferences);
        }

        // set the aggregates
        if (this.currentList.aggregates) {
            this.selectedAggregates = JSON.parse(atob(this.currentList.aggregates));
        } else {
            this.selectedAggregates = [];
        }

        if (this.currentList.sortfields) {
            this.sortArray = JSON.parse(atob(this.currentList.sortfields));
        } else {
            this.sortArray = sortArray;
        }

        // set the listtype
        if (this.currentList.listcomponent) {
            this.listcomponent = this.currentList.listcomponent;
        } else {
            let preflist = this.userpreferences.getPreference('defaultlisttype', this.module);
            if (preflist) this.listcomponent = preflist;
        }

        // emit the change
        this.listtype$.next(listType);

        // get the list data
        if(loadlist) {
            this.getListData();
        }
    }


    /**
     * build the listfields based on the listtype
     */
    private determineListFields(listtype?) {
        this._listfields = [];

        // check if we have fielddefs
        let fielddefs = this.getFieldDefs();

        // load all fields from the selected component configs
        let componentconfig = this.metadata.getComponentConfig(this.listcomponent, this.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            // check if we have the field in the defs
            let fielddef = fielddefs ? fielddefs.find(fd => fd.id == listField.id) : undefined;
            if (fielddefs && fielddef) {
                this._listfields.push({
                    id: listField.id,
                    field: listField.field,
                    fieldconfig: listField.fieldconfig,
                    sort: fielddef.sort,
                    width: fielddef.width
                });
            } else if (!fielddefs && listField.fieldconfig.default !== false) {
                this._listfields.push({
                    id: listField.id,
                    field: listField.field,
                    fieldconfig: listField.fieldconfig
                });
            }
        }

        // sort listfields by fielddefs if we have them
        if (fielddefs) {
            this._listfields.sort((a, b) => fielddefs.findIndex(ai => ai.id == a.id) > fielddefs.findIndex(bi => bi.id == b.id) ? 1 : -1);
        }
    }


    /**
     * get the defined listfields
     */
    get listfields() {
        return this._listfields;
    }


    /**
     * sets the defined listfields
     *
     * @param listfields
     */
    set listfields(listfields) {
        // set the listfields internally
        this._listfields = listfields;

        // check if we have an field in the sortarray that is no longer in the fieldlist
        /*
        if (this.sortArray.length > 0) {
            let i = 0;
            for (let i = 0; i++; i < this.sortArray.length) {
                if (!this._listfields.find(listfield => listfield.id == this.sortArray[i].sortfield)) {
                    this.sortArray.splice(i, 1);
                }
            }
        }
        */

        for (let i in this.sortArray) {
            if (!this._listfields.find(listfield => listfield.field == this.sortArray[i].sortfield)) {
                this.sortArray.splice(parseInt(i, 10), 1);
            }
        }

        // emit the change so all components are aware and can react
        this.listfield$.emit(this._listfields);
    }


    /**
     * check if the current lst can be deleted
     *
     * ToDo: check if still needed
     */
    public canDelete(): boolean {
        try {
            return this.currentList != 'all' && this.currentList != 'owner';
        } catch (e) {
            return false;
        }
    }

    /**
     * returns true if the filters can be set and saved
     */
    public filterEnabled() {
        try {
            return this.currentList.id != 'all' && this.currentList.id != 'owner';
        } catch (e) {
            return false;
        }
    }

    /**
     * returns true if aggregates have been returned for the list and thus can be set
     */
    public aggregatesEnabled() {
        try {
            return this.searchAggregates && !_.isEmpty(this.searchAggregates) ? true : false;
        } catch (e) {
            return false;
        }
    }

    /**
     * handles the saving or retrieving of list results
     */
    private setToSession() {
        // only if the results shoudl be cached
        if (!this.usecache) return false;

        // set to the session
        this.configuration.setData('lastlist_' + this.module, {
            module: this.module,
            listtype: this.listtype,
            listcomponent: this.listcomponent,
            listdata: this.listData,
            sortarray: this.sortArray,
            searchterm: this.searchTerm,
            searchaggregates: this.searchAggregates,
            selectedaggregates: this.selectedAggregates,
            buckets: this.buckets
        });
    }

    /**
     * gets the latest search from the session
     */
    public getFromSession() {
        // let listData = this.session.getSessionData('lastlist_' + this.module, false);
        let listData = this.configuration.getData('lastlist_' + this.module);
        if (listData) {
            // set the module and load the list types
            this._module = listData.module;
            this.loadListTypes();

            for (let thisListType of this.getListTypes()) {
                if (thisListType.id === listData.listtype) {
                    this.currentList = thisListType;
                }
            }
            this.listcomponent = listData.listcomponent;
            this.listData = listData.listdata;
            this.searchTerm = listData.searchterm;
            this.searchAggregates = listData.searchaggregates;
            this.selectedAggregates = listData.selectedaggregates;
            this.sortArray = listData.sortarray;
            this.buckets = listData.buckets;

            // determine the list fields
            this.determineListFields();

            return true;
        } else {
            return false;
        }
    }

    /*
     getter functions
     */
    public getListTypeName(listType: string = '') {
        try {
            return this.getListTypes().find(lt => lt.id == (listType ? listType : this.currentList.id)).name;
        } catch (e) {
            return listType ? listType : this.currentList.id;
        }
    }

    public getGlobal(): boolean {
        return this.currentList.global == '1' ? true : false;
    }

    public getFieldDefs(): any[] {
        try {
            return JSON.parse(atob(this.currentList.fielddefs));
        } catch (e) {
            return undefined;
        }
    }

    /**
     * returns the filterdefs for the list type .. if not an empty filterdefs object
     */
    public getFilterDefs(): any {
        try {
            return JSON.parse(this.currentList.filterdefs);
        } catch (e) {
            return {
                logicaloperator: 'and',
                groupscope: 'all',
                conditions: []
            };
        }
    }

    /**
     * adds a new list type
     *
     * @param name
     * @param global
     */
    public addListType(name, global): Observable<boolean> {
        let retSub = new Subject<boolean>();
        let listParams = {
            list: name,
            global: global
        };
        this.backend.postRequest(
            "spiceui/core/modules/" + this.module + "/listtypes",
            {},
            JSON.stringify(listParams)
        ).subscribe((listdata: any) => {
            this.addCustomListtype(listdata.id, listdata.name, null, null, listdata.global);

            // ad it to the metadata colection as well
            this.metadata.addModuleListType(this.module, {
                id: listdata.id,
                name: listdata.name,
                fielddefs: null
            });

            this.setListType(listdata.id);
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
    }

    /**
     * update the listtype on the backend
     *
     * @param listParams
     * @param reload default to true and the list will be reloaded
     */
    public updateListType(listParams?, reload: boolean = false): Observable<boolean> {
        let retSub = new Subject<boolean>();

        // initialize the list params if they are not set
        if (!listParams) {
            listParams = {};
        }

        // set the aggregates
        listParams.aggregates = btoa(JSON.stringify(this.selectedAggregates));

        // set the list component
        listParams.listcomponent = this.listcomponent;

        // set the sort data
        listParams.sortfields = btoa(JSON.stringify(this.sortArray));

        // set the listfields
        let fielddefs = [];
        for (let listfield of this.listfields) {
            fielddefs.push({
                id: listfield.id,
                width: listfield.width
            });
        }
        listParams.fielddefs = btoa(JSON.stringify(fielddefs));

        // post to the backend
        this.backend.postRequest(`spiceui/core/modules/${this.module}/listtypes/${this.currentList.id}`, {}, listParams).subscribe(listdata => {
            this.listTypes.some(item => {
                if (item.id == this.currentList.id) {

                    for (let key in listParams) {
                        if (listParams.hasOwnProperty(key)) {
                            item[key] = listParams[key];
                        }
                    }
                    this.currentList = item;
                    return true;
                }
            });
            listParams.id = this.currentList.id;
            this.metadata.updateModuleListType(this.module, listParams);

            // reload the list
            if (reload) {
                this.reLoadList();
            }

            // return message to Observable and complete it
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
    }

    /**
     * delete a listtype
     *
     * @param id
     */
    public deleteListType(id: string = '') {
        if (id === '') {
            id = this.currentList.id;
        }

        this.backend.deleteRequest("spiceui/core/modules/" + this.module + "/listtypes/" + id).subscribe(
            res => {
                // set the new default listtype
                this.setListType('all');

                // remove the deleted listtype from the current list
                this.listTypes = this.metadata.deleteModuleListType(this.module, id);
            },
            error => {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            });
    }

    /**
     * returns the last load time in user format
     */
    public getLastLoadTime(): string {
        return this.lastLoad.format(this.userpreferences.getTimeFormat());
    }

    /**
     * resets the list and loads the data
     *
     * @param fields
     * @param checkSession
     */
    public getListData(fields?: any[]): Observable<boolean> {
        this.resetListData();

        // check if we have fields defined or use the last fields
        if (!fields) {
            fields = this.lastFields;
        } else {
            this.lastFields = fields;
        }

        return this.loadList(fields);
    }

    /**
     * @deprecated
     *
     * @param listType
     */
    public showSearch(listType?) {
        if (!listType) {
            listType = this.listtype;
        }
        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                return thisListType.config.showSearch;
            }
        }
        return false;
    }

    /**
     * reloads the last loaded list
     */
    public reLoadList(quiet: boolean = false) {
        return this.loadList(this.lastFields, quiet);
    }

    /**
     * resets the list data for a reload
     */
    public resetListData() {
        // reset buckets if there are any set
        if (this.buckets && this.buckets.bucketitems) {
            for (let bucketitem of this.buckets.bucketitems) {
                bucketitem.count = 0;
                // bucketitem.value = 0;
                bucketitem.items = 0;
            }
        }

        this.listData = {
            list: [],
            totalcount: 0
        };

        // emit that the data changed
        this.listDataChanged$.next(true);
    }

    /**
     * returns the listtypes
     *
     * @param base set to ture to include the standrad listtypes 'all' & 'owner'
     */
    public getListTypes(base = true) {
        let listTypes: any[] = [];

        if (base) {
            for (let list of this.standardLists) {
                listTypes.push({
                    id: list.id,
                    type: list.type,
                    global: 1,
                    name: list.name.replace('<module>', this.language.getModuleName(this.module)).replace('<LBL_MY>', this.language.getLabel('LBL_MY')).replace('<LBL_ALL>', this.language.getLabel('LBL_ALL')),
                    config: list.config
                });
            }
        }

        for (let list of this.listTypes) {
            listTypes.push(list);
        }

        return listTypes;
    }

    /**
     * a getter to check if the current search result has aggregates
     */
    get hasAggregates() {
        return this.selectedAggregates.length > 0;
    }

    /**
     * sets a set of aggdata to the aggregates
     *
     * @param aggregate
     * @param aggdata
     */
    public setAggregate(aggregate, aggdata) {
        this.selectedAggregates.push(aggregate + '::' + aggdata);
        this.reLoadList();
    }

    /**
     * checks if the field has selected aggregates and returns the number
     *
     * @param aggregatefield
     */
    public getCheckedAggregateCount(aggregatefield): number {
        return this.selectedAggregates.filter(item => item.indexOf(aggregatefield + '::') > -1).length;
    }

    /**
     * checks if the aggregate is set
     *
     * @param aggregate
     * @param aggdata
     */
    public checkAggregate(aggregate, aggdata) {
        return this.selectedAggregates.indexOf(aggregate + '::' + aggdata.trim()) > -1;
    }

    /**
     * removes an aggregate from the set
     *
     * @param aggregate
     * @param aggdata
     */
    public removeAggregate(aggregate, aggdata) {
        let index = this.selectedAggregates.indexOf(aggregate + '::' + aggdata);
        if (index >= 0) {
            this.selectedAggregates.splice(index, 1);
            this.reLoadList();
        }
    }

    /**
     * clears all set aggregates
     */
    public removeAllAggregates() {
        this.selectedAggregates = [];
        this.reLoadList();
    }

    /*
     * select functions
     */
    public setAllSelected() {
        this.listSelected.type = 'all';
        for (let listItem of this.listData.list) {
            listItem.selected = true;
        }

        // emit so items can trigger change detection
        this.selectionChanged$.emit(true);
    }

    public setAllUnselected() {
        this.listSelected.type = 'none';
        for (let listItem of this.listData.list) {
            listItem.selected = false;
        }

        // emit so items can trigger change detection
        this.selectionChanged$.emit(true);
    }

    /**
     * returny the number of selected IDs
     */
    public getSelectedCount() {
        let selCount = 0;
        for (let listItem of this.listData.list) {
            if (listItem.selected) {
                selCount++;
            }
        }
        return selCount;
    }

    /**
     * returns an array with the selected IDs
     */
    public getSelectedIDs(): string[] {
        let ids: string[] = [];
        for (let listItem of this.listData.list) {
            if (listItem.selected) {
                ids.push(listItem.id);
            }
        }
        return ids;
    }

    public getSelectedItems() {
        let items = [];
        for (let listItem of this.listData.list) {
            if (listItem.selected) {
                items.push(listItem);
            }
        }
        return items;
    }

    /**
     * checks the access by action for the current list
     * @param {string} action
     * @returns {boolean}
     */
    public checkAccess(action: 'edit' | 'delete') {
        // no
        if ((action == 'edit' || action == 'delete') && (this.currentList.id == 'all' || this.currentList.id == 'owner')) {
            return false;
        }

        if (this.getGlobal()) {
            switch (action) {
                case 'delete':
                    return this.canDelete() && this.session.authData.admin;
                case 'edit':
                    return this.session.authData.admin;
                default:
                    return false;
            }
        } else {
            switch (action) {
                default:
                    return true;
            }
        }

    }

    /**
     * loads a list with the current settings
     *
     * @param fields
     * @param checksession
     */
    public loadList(fields: any[], quiet: boolean = false): Observable<boolean> {
        let retSub = new Subject<boolean>();
        if (!quiet) {
            // set the service to loading state
            this.isLoading = true;

            // reset the list data
            this.resetListData();
        } else {
            // just reset the bucket items if we have any
            if (this.buckets && this.buckets.bucketitems) {
                for (let bucketitem of this.buckets.bucketitems) {
                    bucketitem.items = 0;
                }
            }
        }

        // set the aggregates
        let aggregates = {};
        aggregates[this.module] = this.selectedAggregates;

        this.backend.getList(this.module, this.sortArray, fields, {
            modulefilter: this.modulefilter,
            filtercontextbeanid: this.filtercontextbeanid,
            start: 0,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchgeo: this.searchGeo,
            aggregates: aggregates,
            buckets: this.buckets,
            relatefilter: this.relatefilter?.active ? this.relatefilter : null
        }).subscribe((res: any) => {
                // set the listdata
                this.listData = res;

                // set also the listcomponent for which the data was retrieved
                this.listData.listcomponent = this.listcomponent;

                // update the timestamp for the last load
                this.lastLoad = new moment();

                // inidcate that we are no longer loading
                this.isLoading = false;

                // set the aggregates
                this.searchAggregates = res.aggregations;

                // set the buckets
                this.buckets = res.buckets;

                // save the current result
                this.setToSession();

                // return & close the subject
                retSub.next(true);
                retSub.complete();
                this.listDataChanged$.next(true);
            }
        );

        return retSub.asObservable();
    }


    /**
     * loads on top of the existing results
     */
    public loadMoreList() {
        if (this.isLoading || this.listData.list.length >= this.listData.totalcount) {
            return false;
        }
        this.isLoading = true;
        let aggregates = {};
        aggregates[this.module] = this.selectedAggregates;
        this.backend.getList(this.module, this.sortArray, this.lastFields, {
            modulefilter: this.modulefilter,
            filtercontextbeanid: this.filtercontextbeanid,
            start: this.listData.list.length,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchgeo: this.searchGeo,
            aggregates: aggregates,
            buckets: this.buckets,
            relatefilter: this.relatefilter?.active ? this.relatefilter : null
        })
            .subscribe((res: any) => {
                this.listData.list = this.listData.list.concat(res.list);
                this.listDataChanged$.next(true);
                this.lastLoad = new moment();

                this.isLoading = false;

                // save the current result
                this.setToSession();

            });
        // }
    }


    /**
     * loads on top of the existing results for a single bucket
     * @param bucketName: string
     */
    public loadMoreBucketList(bucketName) {
        const bucket = this.buckets.bucketitems.find(b => b.bucket == bucketName);

        if (!bucket || this.isLoading || bucket.items >= bucket.items.total) {
            return false;
        }
        this.isLoading = true;
        let aggregates = {};
        aggregates[this.module] = this.selectedAggregates;
        this.backend.getList(this.module, this.sortArray, this.lastFields, {
            modulefilter: this.modulefilter,
            filtercontextbeanid: this.filtercontextbeanid,
            start: this.listData.list.length,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchgeo: this.searchGeo,
            aggregates: aggregates,
            buckets: {
                bucketfield: this.buckets.bucketfield,
                bucketitems: [bucket]
            },
            relatefilter: this.relatefilter?.active ? this.relatefilter : null
        })
            .subscribe((res: any) => {
                bucket.items = res.buckets.bucketitems[0].items;
                this.listData.list = this.listData.list.concat(res.list);
                this.lastLoad = new moment();
                this.listDataChanged$.next(true);
                this.isLoading = false;

                // save the current result
                this.setToSession();
            });
        // }
    }


    /**
     * doanloads a list
     *
     * @param fields
     */
    public exportList(fields?: any[]): Observable<boolean> {

        let retSub = new Subject<boolean>();

        let selectedIds = this.getSelectedIDs();
        if (selectedIds.length > 0) {
            this.backend.getLinkToDownload('/module/' + this.module + '/export', 'POST', {}, {
                ids: selectedIds,
                fields: fields ? fields : this.lastFields
            }, {}).subscribe(
                (downloadurl) => {
                    retSub.next(downloadurl);
                    retSub.complete();
                }
            );
        } else {
            let aggregates = {};
            aggregates[this.module] = this.selectedAggregates;
            this.backend.getLinkToDownload(
                '/module/' + this.module + '/export',
                'POST',
                {},
                {
                    listid: this.currentList.id,
                    modulefilter: this.modulefilter,
                    sortfields: this.sortArray,
                    fields: fields ? fields : this.lastFields,
                    searchterm: this.searchTerm,
                    searchgeo: this.searchGeo,
                    aggregates: aggregates,
                }
            ).subscribe(
                (res) => {
                    retSub.next(res);
                    retSub.complete();
                }
            );
        }
        return retSub.asObservable();
    }

    /**
     * a simple getter for the bucketfield
     */
    get bucketfield() {
        return this.buckets ? this.buckets.bucketfield : '';
    }

    /**
     * a simple getter for the bucketfield
     */
    get bucketamountfield() {
        return this.buckets ? this.buckets.buckettotal : '';
    }

    /**
     * update the buckets
     *
     * @param from the from status
     * @param to the to status
     * @param valuefrom optionala from value, added in the safesubscribe method to get the old value from the backupdata so the update is done properly
     */
    // private updateBuckets(from, to, valuefrom?, valueto?) {
    private updateBuckets(from, to, bucketamountfields = []) {
        // reduce from buckets
        let frombucket = this.buckets.bucketitems.find(bucket => bucket.bucket == from);
        frombucket.items--;
        frombucket.total--;

        // add to the bucket
        let tobucket = this.buckets.bucketitems.find(bucket => bucket.bucket == to);
        tobucket.items++;
        tobucket.total++;

        for (let bucket of this.buckets.buckettotal) {
            for (let bucketamountfield of bucketamountfields) {
                if (bucket.function == "sum" && bucket.name == bucketamountfield.fieldname) {
                    frombucket.values['_bucket_agg_' + bucketamountfield.fieldname] -= bucketamountfield.valuefrom;
                    tobucket.values['_bucket_agg_' + bucketamountfield.fieldname] += bucketamountfield.valueto;
                }
            }

        }

    }

    /**
     * removes one item from a bucket and recues the total by the value
     *
     * @param from
     * @param value
     */
    private removeItemFromBucket(from, bucketamountfields = []) {
        // reduce from buckets
        let frombucket = this.buckets.bucketitems.find(bucket => bucket.bucket == from);
        frombucket.items--;
        frombucket.total--;

        // if we have a total field update that one as well
        for (let bucketamountfield of bucketamountfields) {
            frombucket.values['_bucket_agg_' + bucketamountfield.fieldname] -= bucketamountfield.value;
        }
    }
}
