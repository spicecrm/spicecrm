/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from "./broadcast.service";

@Injectable()
export class assistant {

    assitantItems: Array<any> = [];
    assistantFilters: any = {
        objectfilters: [],
        timefilter: 'all'
    };
    initialized: boolean = false;
    loading: boolean = false;

    activityObjects: Array<any> = ['Tasks', 'Meetings', 'Calls', 'Opportunities', 'Reminders'];
    completeStatuses: Array<string> = ['Completed', 'Deferred', 'Held', 'Not Held'];

    constructor(private modelutilities: modelutilities, private backend: backend, private broadcast: broadcast) {
        // subscribe to the broadcast service
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    handleMessage(message: any) {
        let itemIndex = 0;
        switch (message.messagetype) {
            case 'model.delete':
            case 'assistant.complete':
                this.assitantItems.some(item => {
                    if (item.id == message.messagedata.id) {
                        this.assitantItems.splice(itemIndex, 1);
                        return true;
                    }
                    itemIndex++;
                })
                break;
            case 'model.save':
                this.assitantItems.some(item => {
                    if (item.id == message.messagedata.id) {
                        // check if the item is completed
                        if (message.messagedata.data.status && this.completeStatuses.indexOf(message.messagedata.data.status) >= 0) {
                            this.assitantItems.splice(itemIndex, 1);
                        } else {
                            item.data = message.messagedata.data;
                        }

                        return true;
                    }
                    itemIndex++;
                })
                break;
        }
    }


    initlaize() {
        if (!this.initialized) {
            this.loadItems();
            this.initialized = true;
        }
    }

    loadItems(): Observable<any> {

        this.loading = true;

        this.assitantItems = [];
        let retSubject = new Subject<any>();

        // build the filter
        let reqParams = {
            objectfilters: JSON.stringify(this.assistantFilters.objectfilters),
            timefilter: this.assistantFilters.timefilter
        };

        this.backend.getRequest('assistant/list', reqParams).subscribe(retData => {
            for (let retItem of retData) {
                let transverseddata = [];
                for (let fieldName in retItem.data) {
                    transverseddata[fieldName] = this.modelutilities.backend2spice(retItem.module, fieldName, retItem.data[fieldName]);
                }

                this.assitantItems.push({
                    id: retItem.id,
                    module: retItem.module,
                    date_activity: retItem.date_activity,
                    data: transverseddata
                })
            }

            retSubject.next(this.assitantItems);
            retSubject.complete();

            this.loading = false;
        })
        return retSubject.asObservable();
    }
}
