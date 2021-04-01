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

    private handleMessage(message: any) {
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


    public initialize() {
        if (!this.initialized) {
            this.loadItems();
            this.initialized = true;
        }
    }

    public loadItems(): Observable<any> {

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
        });
        return retSubject.asObservable();
    }
}
