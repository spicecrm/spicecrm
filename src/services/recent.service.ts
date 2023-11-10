/**
 * @module services
 */
import {EventEmitter, Injectable, Output} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Subject, of, Observable} from 'rxjs';

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
        }
    }

    /**
     * tracks an individual item by id
     * @param module_name
     * @param item_id
     * @param item_data
     */
    public trackItem(module_name: string, item_id: string, item_data: any) {

        // load recentItems from array if cache is empty
        const cachedItems = this.configuration.getData('recentitems');
        if(!cachedItems) this.getRecentItems();

        // handle the general tracker
        this.recentItems.some((item, index) => {
            if (item.module_name === module_name && item.item_id == item_id) {
                this.recentItems.splice(index, 1);
                return true;
            }
        });

        this.recentItems.splice(0, 0, {
            item_id,
            module_name,
            item_summary: item_data.summary_text,
            data: this.backend.modelutilities.spiceModel2backend(module_name, item_data)
        });

        while (this.recentItems.length > 50) {
            this.recentItems.pop();
        }

        // handle the module specific tracker
        if (this.moduleItems[module_name]) {
            this.moduleItems[module_name].some((item, index) => {
                if (item.item_id == item_id) {
                    this.moduleItems[module_name].splice(index, 1);
                    return true;
                }
            });

            this.moduleItems[module_name].splice(0, 0, {
                item_id,
                module_name,
                item_summary: item_data.summary_text,
                data: item_data
            });

            while (this.moduleItems[module_name].length > 5) {
                this.moduleItems[module_name].pop();
            }
        }

        // cache the item in appdata
        this.configuration.setData('recentitems', this.recentItems, false);
    }

    /**
     * retrieves an individual module
     * @param module
     */
    public getModuleRecent(module: string): Observable<any> {
        // special handling for Home
        if (module == 'Home') {
            // return 5 items
            return of(this.recentItems.slice(0, 5));
        } else {
            if (this.moduleItems[module]) {
                return of(this.moduleItems[module]);
            } else {
                let responseSubject = new Subject<any[]>();
                if (!this.moduleItems[module]) {
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
                    });
                }
                return responseSubject.asObservable();
            }
        }
    }

    /**
     * retrieves recent items from backend & caches them
     */
    public getRecentItems(): Observable<any> {

        let responseSubject: Subject<any[]> = new Subject<any[]>();

        const cachedItems = this.configuration.getData('recentitems');

        if (cachedItems) {
            this.recentItems = cachedItems;
            this.isInitialized = true;
        } else {
            this.backend.getRequest('module/Trackers/recentitems', {}, this.httpRequestsRefID).subscribe(res => {
                this.recentItems = res;
                this.configuration.setData('recentitems', this.recentItems);
                this.isInitialized = true;

                responseSubject.next(this.recentItems);
                responseSubject.complete();
            });
        }

        return responseSubject.asObservable();
    }

}
