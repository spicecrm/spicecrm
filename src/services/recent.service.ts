/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Subject, of, Observable} from 'rxjs';

@Injectable()
export class recent {
    // public items: any[] = [];
    public moduleItems: any = {};

    constructor(public backend: backend, public broadcast: broadcast, public configuration: configurationService, public session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get items(): any[] {
        let recentItems = this.configuration.getData('recentitmes');
        return recentItems ? recentItems : [];
    }

    public handleMessage(message: any) {
        switch (message.messagetype) {
            case 'model.save':
                let item = this.items.find(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
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
                let itemIndex = this.items.findIndex(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                if (itemIndex) {
                    this.items.splice(itemIndex, 1);
                }

                if (this.moduleItems[message.messagedata.module]) {
                    let mitemIndex = this.moduleItems[message.messagedata.module].findIndex(i => i.module_name == message.messagedata.module && i.item_id == message.messagedata.id);
                    if (mitemIndex) {
                        this.items.splice(mitemIndex, 1);
                    }
                }

                break;
        }
    }

    public trackItem(module_name: string, item_id: string, item_data: any) {
        // handle the general tracker
        this.items.some((item, index) => {
            if (item.module_name === module_name && item.item_id == item_id) {
                this.items.splice(index, 1);
                return true;
            }
        });

        this.items.splice(0, 0, {
            item_id,
            module_name,
            item_summary: item_data.summary_text,
            data: item_data
        });

        while (this.items.length > 50) {
            this.items.pop();
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
    }

    public getModuleRecent(module: string): Observable<any> {
        // special handling for Home
        if (module == 'Home') {
            // return 5 items
            return of(this.items.slice(0, 5));
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
}
