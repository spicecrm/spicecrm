/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Subject, of, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {modelutilities} from "./modelutilities.service";
import moment from "moment";

@Injectable({
    providedIn: 'root'
})
export class recent {

    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('recent_items_http_ref_');

    /**
     * holds module items
     */
    public moduleItems: any = {};

    /**
     * holds (cached) recent items
     */
    public recentItems: any[] = [];

    /**
     * holds info whether recent items
     * are initialized
     */
    public isInitialized: boolean = false;

    constructor(
        public backend: backend,
        public broadcast: broadcast,
        public configuration: configurationService,
        public modelutils: modelutilities,
        public session: session)
    {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    public handleMessage(message: any) {
        switch (message.messagetype) {
            case 'model.save':
                let item = this.recentItems.find(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                if (item) {
                    item.data = message.messagedata.data;
                    item.item_summary = message.messagedata.data.summary_text;
                }

                if (this.moduleItems[message.messagedata.module]) {
                    let mitem = this.moduleItems[message.messagedata.module].find(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                    if (mitem) {
                        mitem.data = message.messagedata.data;
                        mitem.item_summary = message.messagedata.data.summary_text;
                    }
                }

                break;
            case 'model.delete':
                let itemIndex = this.recentItems.findIndex(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                if (itemIndex) {
                    this.recentItems.splice(itemIndex, 1);
                }

                if (this.moduleItems[message.messagedata.module]) {
                    let mitemIndex = this.moduleItems[message.messagedata.module].findIndex(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                    if (mitemIndex) {
                        this.recentItems.splice(mitemIndex, 1);
                    }
                }

                break;
            case 'logout':
                // reset the service if we logout
                this.recentItems = [];
                this.moduleItems = {};
                this.isInitialized = false;
                break;
        }
    }

    /**
     * tracks an individual item by id
     * @param module_name
     * @param item_id
     * @param item_data
     */
    public trackItem(module_name: string, item_id: string, item_data: any) {
        this.pushTrackedItemToRecentItems(module_name, item_id, item_data);
        this.pushTrackedItemToModuleItems(module_name, item_id, item_data);
    }

    /**
     * cache recently viewed items per module
     * i.e. only Account items
     * @param module_name
     * @param item_id
     * @param item_data
     * @private
     */
    private pushTrackedItemToModuleItems(module_name: string, item_id: string, item_data: any) {

        const cachedModuleItems = this.configuration.getData('moduleRecentItems');
        // do not continue if we don't have cache
        if (!cachedModuleItems || !cachedModuleItems[module_name]) return;

        // handle the module specific tracker
        if (this.moduleItems[module_name]) {
            this.moduleItems[module_name].some((item, index) => {
                if (item.item_id == item_id) {
                    this.moduleItems[module_name].splice(index, 1);
                    return true;
                }
            });
            cachedModuleItems[module_name].some((item, index) => {
                if (item.item_id == item_id) {
                    cachedModuleItems[module_name].splice(index, 1);
                    return true;
                }
            });

            const item = {
                item_id,
                module_name,
                item_summary: item_data.summary_text,
                date_modified: moment().format('YYYY-MM-DD HH:mm:ss'),
                // deep clone the item data
                data: this.modelutils.spiceModel2backend(module_name, JSON.parse(JSON.stringify(item_data)))
            };

            this.moduleItems[module_name].unshift(item);
            cachedModuleItems[module_name].unshift(item);

            while (this.moduleItems[module_name].length > 5) {
                this.moduleItems[module_name].pop();
            }
        }

        // cache recent module items in browser
        this.configuration.setData('moduleRecentItems', JSON.parse(JSON.stringify(cachedModuleItems)), false);
    }

    /**
     * cache all recently viewed items
     * i.e. items of Accounts, Contacts, Calls...
     * @param module_name
     * @param item_id
     * @param item_data
     */
    private pushTrackedItemToRecentItems(module_name: string, item_id: string, item_data: any) {

        const recentCache = this.configuration.getData('recentItems');

        // do not continue if we don't have cache
        if (!recentCache) return;

        // handle the general tracker
        this.recentItems.some((item, index) => {
            if (item.module_name === module_name && item.item_id == item_id) {
                this.recentItems.splice(index, 1);
                return true;
            }
        });
        recentCache.some((item, index) => {
            if (item.module_name === module_name && item.item_id == item_id) {
                recentCache.splice(index, 1);
                return true;
            }
        });

        const item = {
            item_id,
            module_name,
            item_summary: item_data.summary_text,
            date_modified: moment().format('YYYY-MM-DD HH:mm:ss'),
            // deep clone the item data
            data: this.backend.modelutilities.spiceModel2backend(module_name, JSON.parse(JSON.stringify(item_data)))
        };

        this.recentItems.unshift(item);
        recentCache.unshift(item);

        while (this.recentItems.length > 50) {
            this.recentItems.pop();
        }

        // cache recent items in browser
        this.configuration.setData('recentItems', JSON.parse(JSON.stringify(recentCache)), false);
    }

    /**
     * retrieves an individual module
     * @param module
     */
    public getModuleRecent(module: string): Observable<any> {
        // special handling for Home
        if (module == 'Home') {
            // return 5 items
            return this.getRecentItems().pipe(map(v => v.slice(0,5)));
        } else {
            const cachedModuleItems = this.configuration.getData('moduleRecentItems');

            if (cachedModuleItems && cachedModuleItems[module]) {
                // manipulate referenced object due to date format issues
                this.moduleItems[module] = JSON.parse(JSON.stringify(cachedModuleItems[module]));

                return of(this.moduleItems[module]);
            } else {
                let responseSubject = new Subject<any[]>();

                this.backend.getRequest('module/Trackers/recent', {
                    module: module,
                    limit: 5
                }).subscribe(response => {
                    this.moduleItems[module] = [];
                    for (let item of response) {
                        this.moduleItems[module].push(item);
                    }
                    responseSubject.next(this.moduleItems[module]);
                    responseSubject.complete();

                    // cache in browser & manipulate backend response due to date format issues
                    this.configuration.setData('moduleRecentItems', JSON.parse(JSON.stringify(this.moduleItems)), false);
                });

                return responseSubject.asObservable();
            }
        }
    }

    /**
     * retrieves recent items from backend & caches them
     */
    public getRecentItems(): Observable<any> {

        let responseSubject: Subject<any[]> = new Subject<any[]>();

        const cachedItems = this.configuration.getData('recentItems');

        if (cachedItems) {
            // manipulate referenced object due to date format issues
            this.recentItems = JSON.parse(JSON.stringify(cachedItems));

            this.isInitialized = true;

            responseSubject.next(this.recentItems);
            responseSubject.complete();
        } else {
            this.backend.getRequest('module/Trackers/recentitems', {}, this.httpRequestsRefID).subscribe(res => {
                this.recentItems = res;

                // cache in browser & manipulate backend response due to date format issues
                this.configuration.setData('recentItems', JSON.parse(JSON.stringify(res)), false);
                this.isInitialized = true;

                responseSubject.next(this.recentItems);
                responseSubject.complete();
            });
        }

        return responseSubject.asObservable();
    }

}
