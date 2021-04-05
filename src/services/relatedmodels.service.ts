/*
SpiceUI 2021.01.001

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

import {EventEmitter, Injectable, OnDestroy} from "@angular/core";
import {broadcast} from "./broadcast.service";
import {backend} from "./backend.service";
import {metadata} from "./metadata.service";
import {modelutilities} from "./modelutilities.service";
import {Observable, of, Subject} from "rxjs";
import {toast} from "./toast.service";
import {language} from './language.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * handles related models for subpanels etc.
 */
@Injectable()
export class relatedmodels implements OnDestroy {
    /**
     * the parent module
     */
    public module = '';

    /**
     * the id of the parent records
     */
    public id = '';

    /**
     * the related Model
     */
    public model: any;

    /**
     * the related module
     */
    public relatedModule = '';

    /**
     * the link in the parents vardefs. If none is set it is assmed that the name of the link is the same as the name of the module but in lowercase
     */
    public linkName = '';

    /**
     * alternative to the link a specific endoint can be specified that is called instead of the relationship
     * instead of the regular endpoint the endppint is then composed out of module/${this.module}/${this.id}/ + the endpoint defined here
     * the endpoint needs to be defined as extension on the module and needs to be implemented as GET request
     */
    public linkEndPoint: string;

    /**
     * an optional filterid to be applied to the selection of the related models
     */
    public modulefilter = '';

    /**
     * add filters by fieldname and fieldvalue
     */
    public fieldfilters: any = {};
    /**
     * an array with the related records
     */
    public items: any[] = [];

    /**
     * the total count o related records
     */
    public count = 0;

    /**
     * default value for number of items loaded with a backend request
     */
    public loaditems = 5;

    /**
     * ToDo: check wha this is for
     */
    private relationshipFields: string[] = [];

    /**
     * inidcates if the servic eis currently retrieving data from teh backend
     */
    public isloading = false;

    /**
     * inidcates if the servic eis currently retrieving data from teh backend
     */
    public isonlyfiltered = false;

    /**
     * sort parameters
     */
    public sort: any = {
        sortfield: '',
        sortdirection: 'ASC'
    };

    /**
     *  a moment object for the indication when the data was last loaded
     *
     *  currently only used for display purposes
     */
    private lastLoad: any = new moment();

    /**
     * an optional sequence field. if a value is set the table can be sequenced by drag and drop
     */
    public sequencefield: string = null;

    /**
     * a handler to the broadcast subscrition. Making sure the susbcription is cancelled whent he component is destroyed
     */
    private serviceSubscriptions: any[] = [];

    constructor(
        private metadata: metadata,
        private backend: backend,
        private broadcast: broadcast,
        private modelutilities: modelutilities,
        private toast: toast,
        private language: language
    ) {
        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    /**
     * @ignore
     *
     * cancel the subscription
     */
    public ngOnDestroy(): void {
        this.stopSubscriptions();
    }

    /**
     * to be called when the component for this servuice is destroyed
     */
    public stopSubscriptions() {
        for (let subscription of this.serviceSubscriptions) {
            subscription.unsubscribe();
        }
        this.serviceSubscriptions = [];
    }

    /**
     * a getter for the sortfield currently set
     */
    get sortfield() {
        return this.sort.sortfield;
    }

    /**
     * set the sortfield and sort the results
     *
     * @param field the fieldname
     */
    set sortfield(field) {
        if (this.sort.sortfield == field) {
            this.sort.sortdirection = this.sort.sortdirection == "ASC" ? "DESC" : "ASC";
        } else {
            this.sort.sortfield = field;
            this.sort.sortdirection = "ASC";
        }

        this.getData();
    }

    /**
     * simple getter for the linkname
     *
     * @private
     */
    get _linkName() {
        return this.linkName != "" ? this.linkName : this.relatedModule.toLowerCase();
    }

    /**
     * getter for the sequencefield
     */
    get sortBySequencefield() {
        if (this.sequencefield && !this.modulefilter && !this.sort.sortfield) return true;
        else return false;
    }

    /**
     * handler for teh broadcast messeg
     *
     * this handles delete and save actions and updates the related list items when in opther areas of the application a model is changed
     *
     * @param message
     */
    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf("model") === -1 || message.messagedata.module !== this.relatedModule) {
            return;
        }

        switch (message.messagetype) {
            case "model.delete":
                this.items.some((item, i) => {
                    if (item.id === message.messagedata.id) {
                        this.items.splice(i, 1);
                        this.count--;
                        // emit that a change has happened
                        // this.items$.emit(this.items);
                        return true;
                    }
                });
                break;
            case "model.save":
                let eventHandled = false;
                for (let item of this.items) {
                    if (item.id === message.messagedata.id) {
                        for (let key in item) {
                            if (item.hasOwnProperty(key) && message.messagedata.data.hasOwnProperty(key)) {
                                item[key] = message.messagedata.data[key];
                            }
                        }
                        eventHandled = true;
                        this.sortItems();
                    }
                }

                if (!eventHandled || this.modulefilter) {
                    this.getData(true);
                } else {
                    this.sortItems();
                }

                break;
        }
    }

    /**
     * returns the last load time
     *
     * ToDo: change to user preferences so it is properly displayed in the users time settings
     */
    public getLastLoadTime(): string {
        return this.lastLoad.format("HH:mm");
    }

    /**
     * get the data. Resets all currently loaded data and reloads from scratch
     *
     * @param silent if set to true all items will remain in the list and the user will not dierclty see that the related list is loading
     */
    public getData(silent: boolean = false): Observable<any>  {
        let responseSubject = new Subject<any>();
        // check if we can list per acl
        if (this.metadata.checkModuleAcl(this.relatedModule, "list") === false && this.metadata.checkModuleAcl(this.relatedModule, "listrelated") === false) {
            return of(false);
        }

        // set that we are loading
        if (!silent) {
            this.resetData();
            this.isloading = true;
        }
        let params = {
            module: this.relatedModule,
            getcount: true,
            offset: 0,
            limit: this.loaditems,
            modulefilter: this.modulefilter,
            fieldfilters: this.fieldfilters,
            relationshipFields: JSON.stringify(this.relationshipFields),
            sort: this.sort.sortfield ? JSON.stringify(this.sort) : ""
        };

        let url = `module/${this.module}/${this.id}/` + (this.linkEndPoint ? this.linkEndPoint : `related/${this._linkName}`)
        this.backend.getRequest(url, params).subscribe(
            (response: any) => {

                // reset the list .. to make sure nobody added in the meantime ... the new data is the truth
                this.items = [];

                // get the count
                this.count = parseInt(response.count, 10);

                // count .. this is not an array but an object
                for (let key in response.list) {
                    if (response.list.hasOwnProperty(key)) {
                        response.list[key].relid = key;

                        response.list[key] = this.modelutilities.backendModel2spice(this.relatedModule, response.list[key]);

                        this.items.push(response.list[key]);
                    }
                }

                // set loaded
                this.isloading = false;

                // sort
                this.sortItems();

                // set the load time
                this.lastLoad = new moment();

                // emit that a change has happened
                // this.items$.emit(this.items);

                // complete the Observable
                responseSubject.next(true);
                responseSubject.complete();
            },
            error => {
                // set loaded
                this.isloading = false;
            }
        );

        return responseSubject.asObservable();
    }

    /**
     * a short getter to indicate if more items can be loaded
     */
    get canloadmore() {
        return !this.isloading && this.count && this.count - this.items.length > 0;
    }

    /**
     * loads the next set of items
     *
     * @param loaditems the number of items to be laoded
     */
    public getMoreData(loaditems = 5): Observable<any> {

        // check if we can list per acl
        if (this.metadata.checkModuleAcl(this.relatedModule, "list") === false) {
            return of(true);
        }

        this.isloading = true;

        let params = {
            module: this.relatedModule,
            getcount: true,
            offset: this.items.length,
            limit: this.items.length + loaditems,
            modulefilter: this.modulefilter,
            relationshipFields: JSON.stringify(this.relationshipFields),
            sort: this.sort.sortfield ? JSON.stringify(this.sort) : ""
        };

        let retSubject = new Subject<any>();

        // compose a URL depending if wee have a specific endpoint defined
        let url = `module/${this.module}/${this.id}/` + (this.linkEndPoint ? this.linkEndPoint : `related/${this._linkName}`)

        // get the data
        this.backend.getRequest(url, params).subscribe(
            (response: any) => {

                // get the count
                this.count = parseInt(response.count, 10);

                // count .. this is not an array but an object
                for (let key in response.list) {
                    if (response.list.hasOwnProperty(key)) {
                        response.list[key].relid = key;

                        response.list[key] = this.modelutilities.backendModel2spice(this.relatedModule, response.list[key]);

                        this.items.push(response.list[key]);
                    }
                }

                // sort
                this.sortItems();

                // set the load time
                this.lastLoad = new moment();

                // emit that a change has happened
                // this.items$.emit(this.items);

                this.isloading = false;

                retSubject.next(true);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    /**
     * sorts the items according to the sort settings
     */
    private sortItems() {

        let sortfield: string;
        let sortdirection: string;
        if (this.sort.sortfield) {
            sortfield = this.sort.sortfield;
            sortdirection = this.sort.sortdirection;
        } else if (this.sortBySequencefield) {
            sortfield = this.sequencefield;
            sortdirection = 'ASC';
        }

        if (sortfield) {
            this.items.sort((a, b) => {
                let sortval = 0;
                // check if we can sort as integer
                if (!isNaN(parseInt(a[sortfield], 10)) && !isNaN(parseInt(b[sortfield], 10))) {
                    sortval = parseInt(a[sortfield], 10) > parseInt(b[sortfield], 10) ? 1 : -1;
                } else {
                    sortval = a[sortfield] > b[sortfield] ? 1 : -1;
                }
                return sortdirection == 'ASC' ? sortval : (sortval * -1);
            });
        }

    }

    /**
     * helper method to reset the items
     */
    public resetData() {
        this.items = [];
    }

    /**
     * helper to add items when called fromt eh handler
     *
     * @param items
     */
    public addItems(items) {

        if (!this.isonlyfiltered) {
            let relatedIds: any[] = [];
            for (let item of items) {
                relatedIds.push(item.id);
            }
            this.backend.postRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, [], relatedIds).subscribe(res => {

                for (let item of items) {
                    // check if we shoudl add this item or it is already in the related models list
                    let itemfound = false;
                    this.items.some(curitem => {
                        if (curitem.id == item.id) {
                            itemfound = true;
                            return true;
                        }
                    });
                    if (!itemfound) {
                        this.items.push(item);
                        this.count++;
                    }
                }

                // emit that a change has happened
                // this.items$.emit(this.items);

                // this.items = this.items.concat(items);
                // this.count += items.length;
            });
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_NOT_POSSIBLE_TO_ADD'), 'error');
        }
    }

    /**
     * set item data
     *
     * ToDo: check where this is called from
     *
     * @param item the item
     */
    public setItem(item): Observable<any> {
        if (!this.isonlyfiltered) {
            let retSubject = new Subject<any>();
            this.backend.putRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, [], this.modelutilities.spiceModel2backend(this.relatedModule, item)).subscribe(res => {
                    retSubject.next(true);
                    retSubject.complete();
                },
                error => {
                    retSubject.error(error);
                    retSubject.complete();
                });
            return retSubject.asObservable();
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_NOT_POSSIBLE_TO_SET'), 'error');
            return of(true);
        }
    }

    /**
     * removes the relationship for an items
     *
     * @param id the related id
     */
    public deleteItem(id) {
        if (!this.isonlyfiltered) {
            let relatedids = [];
            relatedids.push(id);
            let params = {
                relatedids: relatedids
            };
            this.backend.deleteRequest("module/" + this.module + "/" + this.id + "/related/" + this._linkName, params).subscribe(res => {
                this.items.some((item, index) => {
                    if (item.id == id) {
                        this.items.splice(index, 1);
                        this.count--;
                        // emit that a change has happened
                        // this.items$.emit(this.items);
                        // return
                        return true;
                    }
                });
            });
        } else {
            this.toast.sendToast(this.language.getLabel('LBL_NOT_POSSIBLE_TO_SET'), 'error');
        }
    }
}

