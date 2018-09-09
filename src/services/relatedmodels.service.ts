import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate}    from '@angular/router';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {broadcast} from './broadcast.service';
import {backend} from './backend.service';
import {metadata} from './metadata.service';
import {modelutilities} from './modelutilities.service';
import {Router}   from '@angular/router';

declare var moment: any;

@Injectable()
export class relatedmodels {
    module: string = '';
    relatedModule: string = '';
    linkName: string = '';
    id: string = '';
    items: any = [];
    items$ = new EventEmitter();
    count: number = 0;
    loaditems: number = 5;
    relationshipFields: Array<string> = [];
    isloading: boolean = true;
    sort: any = {
        sortfield: '',
        sortdirection: 'ASC'
    };
    lastLoad: any = new moment();

    serviceSubscriptions: Array<any> = [];

    constructor(
        private metadata: metadata,
        private backend: backend,
        private broadcast: broadcast,
        private modelutilities: modelutilities
    ) {
        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    stopSubscriptions() {
        for (let subscription of this.serviceSubscriptions) {
            subscription.unsubscribe();
        }
    }

    get sortfield() {
        return this.sort.sortfield;
    }

    set sortfield(field) {
        if (this.sort.sortfield == field) {
            this.sort.sortdirection = this.sort.sortdirection == 'ASC' ? 'DESC' : 'ASC';
        } else {
            this.sort.sortfield = field;
            this.sort.sortdirection = 'ASC';
        }

        this.getData();
    }

    get _linkName() {
        return this.linkName != '' ? this.linkName : this.relatedModule.toLowerCase();
    }

    handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf('model') === -1 || message.messagedata.module !== this.relatedModule)
            return;

        switch (message.messagetype) {
            case 'model.delete':
                for (let itemIndex in this.items) {
                    if (this.items[itemIndex].id === message.messagedata.id) {
                        this.items.splice(itemIndex, 1);
                        this.count--;

                        // emit that a change has happened
                        this.items$.emit(this.items);
                    }
                }
                break;
            case 'model.save':
                this.getData();
                /*
                let eventHandled = false;
                for (let item of this.items) {
                    if (item.id === message.messagedata.id) {
                        for (let key in item) {
                            if (item.hasOwnProperty(key) && message.messagedata.data.hasOwnProperty(key)) {
                                item[key] = message.messagedata.data[key];
                            }
                        }
                        eventHandled = true;
                    }
                }
                */


                if (!eventHandled)
                    this.getData();
                else
                    this.sortItems();


                break;
        }
    }

    getLastLoadTime(): string {
        return this.lastLoad.format('HH:mm');
    }

    getData() {
        // check if we can list per acl
        if (this.metadata.checkModuleAcl(this.relatedModule, 'list') === false)
            return false;

        // set that we are loading
        this.resetData();
        this.isloading = true;

        let params = {
            getcount: true,
            offset: 0,
            limit: this.loaditems,
            relationshipFields: JSON.stringify(this.relationshipFields),
            sort: this.sort.sortfield ? JSON.stringify(this.sort) : ''
        };

        //this.http.get(this.configurationService.getBackendUrl() + '/module/' + this.module + '/' + this.id + '/related/' + this.relatedModule.toLowerCase() + '?' + params.join('&'))
        this.backend.getRequest('module/' + this.module + '/' + this.id + '/related/' + this._linkName, params).subscribe(
            (response: any) => {

                // reset the list .. to make sure nobody added in the meantime ... the new data is the truth
                this.items = [];

                // get the count
                this.count = parseInt(response.count);

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
                //console.log(`${this.relatedModule} loading finished...`);

                // sort
                this.sortItems();

                // set the load time
                this.lastLoad = new moment();

                // emit that a change has happened
                this.items$.emit(this.items);
            }
        );
    }

    sortItems() {
        if (this.sort.sortfield) {
            this.items.sort((a, b) => {
                let sortval = 0;
                // check if we can sort as integer
                if (!isNaN(parseInt(a[this.sort.sortfield])) && !isNaN(parseInt(b[this.sort.sortfield])))
                    sortval = parseInt(a[this.sort.sortfield]) > parseInt(b[this.sort.sortfield]) ? 1 : -1;
                else
                    sortval = a[this.sort.sortfield] > b[this.sort.sortfield] ? 1 : -1;

                return this.sort.sortdirection == 'ASC' ? sortval : (sortval * -1);
            })
        }
    }

    resetData() {
        this.items = [];
    }

    addItems(items) {
        let relatedIds: Array<any> = [];
        for (let item of items) {
            relatedIds.push(item.id);
        }

        this.backend.postRequest('module/' + this.module + '/' + this.id + '/related/' + this._linkName, [], relatedIds).subscribe(res => {

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
            this.items$.emit(this.items);

            // this.items = this.items.concat(items);
            // this.count += items.length;
        });
    }

    setItem(item) {
        this.backend.putRequest('module/' + this.module + '/' + this.id + '/related/' + this._linkName, [], this.modelutilities.spiceModel2backend(this.relatedModule, item)).subscribe(res => {

        });
    }

    deleteItem(id) {
        let relatedids = [];
        relatedids.push(id);
        let params = {
            relatedids: relatedids
        };
        this.backend.deleteRequest('module/' + this.module + '/' + this.id + '/related/' + this._linkName, params).subscribe(res => {
            this.items.some((item, index) => {
                if (item.id == id) {
                    this.items.splice(index, 1);
                    this.count--;

                    // emit that a change has happened
                    this.items$.emit(this.items);

                    // return
                    return true;
                }
            })
        });
    }
}
