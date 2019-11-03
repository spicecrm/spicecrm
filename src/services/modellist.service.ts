/**
 * @module services
 */
import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject, of, BehaviorSubject} from 'rxjs';
import {backend} from './backend.service';
import {userpreferences} from './userpreferences.service';
import {language} from './language.service';
import {metadata} from "./metadata.service";
import {broadcast} from "./broadcast.service";
import {session} from "./session.service";

/**
 * @ignore
 */
declare var moment: any;

interface geoSearch {
    radius: number;
    lat: number;
    lng: number;
}

@Injectable()
export class modellist implements OnDestroy {

    /**
     * the module the list is for
     */
    public module: string = '';

    /**
     * an optional modulefilter
     */
    public modulefilter: string;

    /**
     * the current list type
     */
    public listtype: string = 'all';

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
        source: undefined
    };

    /**
     * the selected items
     */
    public listSelected: any = {
        type: '',
        items: []
    };

    /**
     * keeps the last retrieved fields
     * ToDo: check if keep that
     */
    public lastFields: any[] = [];

    /**
     * thje sortfield
     */
    public sortfield: string = '';

    /**
     * the sort direction
     */
    public sortdirection: 'ASC'|'DESC' = 'ASC';

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
     * the set search aggregates as returned by the search
     */
    public searchAggregates: any;

    /**
     * the aggregate values the user selected
     */
    public selectedAggregates: any[] = [];

    /**
     * search geo data
     */
    public searchGeo: geoSearch;

    /**
     * for the bucketed views
     */
    public buckets: any = {};

    /**
     * set to true if the data when retrieved shoudl be cahced in the session
     */
    public usecache: boolean = false;

    public standardLists: any[] = [
        {
            id: 'all',
            type: 'all',
            name: '<LBL_ALL> <module>',
            basefilter: 'all',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }, {
            id: 'owner',
            type: 'owner',
            basefilter: 'own',
            name: '<LBL_MY> <module>',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }
    ];
    public listTypes: any[] = [];
    public currentList: any = {};
    public serviceSubscriptions: any[] = [];

    constructor(
        private broadcast: broadcast,
        private backend: backend,
        // private fts: fts,
        private metadata: metadata,
        private language: language,
        private userpreferences: userpreferences,
        private session: session,
    ) {
        // create the event behaviour Subject
        this.listtype$ = new BehaviorSubject<string>('all');

        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.module) {
            return;
        }

        switch (message.messagetype) {
            case 'model.delete':
                for (let itemIndex in this.listData.list) {
                    if (this.listData.list[itemIndex].id === message.messagedata.id) {
                        this.listData.list.splice(itemIndex, 1);
                        this.listData.totalcount--;
                    }
                }
                break;
            case 'model.save':
                let eventHandled = false;
                for (let itemIndex in this.listData.list) {
                    if (this.listData.list[itemIndex].id === message.messagedata.id) {
                        this.listData.list[itemIndex] = message.messagedata.data;
                        eventHandled = true;
                    }
                }
                if (!eventHandled) {
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

    public setModule(module: string) {
        this.module = module;

        // get the custom listtypes
        this.listTypes = [];
        for (let listtype of this.metadata.getModuleListTypes(this.module)) {
            this.addCustomListtype(listtype.id, listtype.name, listtype.basefilter, listtype.fielddefs, listtype.filterdefs, listtype.global);
        }

        // check if we have preferences set for the user
        let modulepreferences = this.userpreferences.getPreference(module);
        if (modulepreferences && modulepreferences.lastlisttype) {
            this.setListType(modulepreferences.lastlisttype);
        } else {
            this.setListType('all', false);
        }
    }

    public setSortDirection(direction: 'ASC'|'DESC') {
        this.sortdirection = direction;
    }

    public setSortFieldWithoutReload(field: string) {
        this.sortfield = field;
    }

    public setSortField(field: string) {
        if (this.sortfield == field) {
            this.sortdirection = this.sortdirection == 'ASC' ? 'DESC' : 'ASC';
        } else {
            this.sortfield = field;
            this.sortdirection = 'ASC';
        }
        this.reLoadList();
    }

    public addCustomListtype(id, name, basefilter, fielddefs, filterdefs, global): void {
        this.listTypes.push({
            id: id,
            name: name,
            global: global,
            basefilter: basefilter,
            fielddefs: fielddefs,
            filterdefs: filterdefs
        });
    }

    public setListType(listType: string, setPreference = true): void {
        this.listtype = listType;
        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                this.currentList = thisListType;
            }
        }

        // set the user preferences
        if (setPreference) {
            let modulepreferences = this.userpreferences.getPreference(this.module);
            if (!modulepreferences) {
                modulepreferences = {};
            }
            modulepreferences.lastlisttype = listType;
            this.userpreferences.setPreference(this.module, modulepreferences);
        }

        // emit the change
        this.listtype$.next(listType);
    }

    public checkFilterChange(listType): boolean {
        return (listType.basefilter !== this.currentList.basefilter || listType.filterdefs !== this.currentList.filterdefs);
    }

    public canDelete(): boolean {
        try {
            return this.currentList.config.enableDelete;
        } catch (e) {
            return false;
        }
    }

    public filterEnabled() {
        try {
            return this.currentList.id != 'all' && this.currentList.id != 'owner';
        } catch (e) {
            return false;
        }
    }

    public aggregatesEnabled() {
        try {
            return this.searchAggregates ? true : false;
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
        this.session.setSessionData('lastlist', {
            module: this.module,
            listtype: this.listtype,
            listdata: this.listData,
            searchterm: this.searchTerm,
            searchaggregates: this.searchAggregates,
            selectedaggregates: this.selectedAggregates
        }, false);
    }

    /**
     * gets the latest search from the session .. if this is the same as the current module .. initialize accordingly
     */
    private getFromSession() {
        // only if the results shoudl be cached
        if (!this.usecache) return false;

        let listData = this.session.getSessionData('lastlist', false);
        if (listData && listData.module == this.module) {
            this.listtype = listData.listtype;
            this.listData = listData.listdata;
            this.searchTerm = listData.searchterm;
            this.searchAggregates = listData.searchaggregates;
            this.selectedAggregates = listData.selectedaggregates;
            return true;
        } else {
            return false;
        }
    }

    /*
     getter functions
     */

    public getListTypeName(listType: string = '') {
        if (!listType) {
            listType = this.currentList.id;
        }
        // return this.currentList.name;

        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                return thisListType.name;
            }
        }
    }

    public getGlobal(): boolean {
        return this.currentList.global;
    }

    public getFieldDefs(): any[] {
        try {
            return JSON.parse(atob(this.currentList.fielddefs));
        } catch (e) {
            return [];
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
        this.backend.addListType(this.module, listParams).subscribe((listdata: any) => {
            this.addCustomListtype(listdata.id, listdata.name, 'all', null, null, listdata.global);

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
     */
    public updateListType(listParams): Observable<boolean> {
        let retSub = new Subject<boolean>();
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

            // emit since changes might impact others
            this.listtype$.next(this.currentList);

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
    public deleteListType(id: string = ''): Observable<boolean> {
        let retSub = new Subject<boolean>();
        if (id === '') {
            id = this.currentList.id;
        }
        this.backend.deleteListType(id).subscribe(res => {
            // set the new default listtype
            this.setListType('all');

            // remove the deleted listtype from the current list
            this.listTypes.some((item, index) => {
                if (item.id == id) {
                    this.listTypes.splice(index, 1);
                    return true;
                }
            });

            // return the Observable and complete the subject
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
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
    public getListData(fields?: any[], checkSession: boolean = false): Observable<boolean> {
        this.resetListData();

        // check if we have fields defined or use the last fields
        if (!fields) {
            fields = this.lastFields;
        } else {
            this.lastFields = fields;
        }

        // check if we have a sortfield or shoudl set one
        if (!this.sortfield) {
            this.sortfield = fields.length > 0 ? fields[0] : 'id';
        }

        return this.loadList(fields, checkSession);
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
    public reLoadList() {
        return this.loadList(this.lastFields);
    }

    /**
     * resets the list data for a reload
     */
    public resetListData() {
        // reset buckets if there are any set
        if (this.buckets && this.buckets.bucketitems) {
            for (let bucketitem of this.buckets.bucketitems) {
                bucketitem.count = 0;
                bucketitem.value = 0;
                bucketitem.items = 0;
            }
        }

        this.listData = {
            list: [],
            totalcount: 0
        };
    }

    public getListTypes(base = true) {
        let listTypes: any[] = [];

        if (base) {
            for (let list of this.standardLists) {
                listTypes.push({
                    id: list.id,
                    type: list.type,
                    global: 1,
                    name: list.name.replace('<module>', this.language.getModuleName(this.module)).replace('<LBL_MY>', this.language.getLabel('LBL_MY')).replace('<LBL_ALL>', this.language.getLabel('LBL_ALL')),
                    basefilter: list.basefilter,
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
    }

    public setAllUnselected() {
        this.listSelected.type = 'none';
        for (let listItem of this.listData.list) {
            listItem.selected = false;
        }
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
    public checkAccess(action: string) {
        if (this.currentList.global) {
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
    private loadList(fields: any[], checksession: boolean = false): Observable<boolean> {
        let retSub = new Subject<boolean>();
        this.resetListData();

        if (checksession && this.getFromSession()) return of(true);

        this.isLoading = true;

        let aggregates = {};
        aggregates[this.module] = this.selectedAggregates;
        this.backend.getList(this.module, this.sortfield, this.sortdirection, fields, {
            start: 0,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchgeo: this.searchGeo,
            aggregates: aggregates,
            buckets: this.buckets
        }).subscribe((res: any) => {
                this.listData = res;
                this.lastLoad = new moment();

                this.isLoading = false;

                this.searchAggregates = res.aggregations;
                this.buckets = res.buckets;

                // save the current result
                this.setToSession();

                retSub.next(true);
                retSub.complete();
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
        this.backend.getList(this.module, this.sortfield, this.sortdirection, this.lastFields, {
            modulefilter: this.modulefilter,
            start: this.listData.list.length,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchgeo: this.searchGeo,
            aggregates: aggregates,
            buckets: this.buckets
        })
            .subscribe((res: any) => {
                this.listData.list = this.listData.list.concat(res.list);
                this.lastLoad = new moment();

                this.isLoading = false;

                // save the current result
                this.setToSession();

            });
        // }
    }


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
            /*
            if (this.currentList.type == 'all' || this.currentList.type == 'owner') {
                let aggregates = {};
                aggregates[this.module] = this.selectedAggregates;
                this.fts.export(this.searchTerm, this.module, fields ? fields : this.lastFields, aggregates, {
                    sortfield: this.sortfield,
                    sortdirection: this.sortdirection.toLowerCase()
                }, this.currentList.type == 'owner' ? true : false).subscribe(res => {
                    // console.log(res);
                    retSub.next(res);
                    retSub.complete();
                });
            } else {
             */
            this.backend.getLinkToDownload(
                '/module/' + this.module + '/export',
                'POST',
                {},
                {
                    listid: this.currentList.id,
                    sortfield: this.sortfield,
                    sortdirection: this.sortdirection,
                    fields: fields ? fields : this.lastFields
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
}
