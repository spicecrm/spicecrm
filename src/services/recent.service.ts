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

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Subject, of, Observable} from 'rxjs';

@Injectable()
export class recent {
    // public items: any[] = [];
    public moduleItems: any = {};

    constructor(private backend: backend, private broadcast: broadcast, private configuration: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get items(): any[] {
        let recentItems = this.configuration.getData('recentitmes');
        return recentItems ? recentItems : [];
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
            case 'model.save':
                this.items.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.items[index].item_summary = message.messagedata.data.summary_text;
                        this.items[index].data = message.messagedata.data;
                        return true;
                    }
                });

                if (this.moduleItems[message.messagedata.module]) {
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if (item.item_id == message.messagedata.id) {
                            this.moduleItems[message.messagedata.module][index].item_summary = message.messagedata.data.summary_text;
                            this.moduleItems[message.messagedata.module][index].data = message.messagedata.data;
                            return true;
                        }
                    });
                }

                break;
            case 'model.delete':
                this.items.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.items.splice(index, 1);
                        return true;
                    }
                });

                if (this.moduleItems[message.messagedata.module]) {
                    this.moduleItems[message.messagedata.module].some((item, index) => {
                        if (item.item_id == message.messagedata.id) {
                            this.items.splice(index, 1);
                            return true;
                        }
                    });
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
                    this.backend.getRequest('modules/Trackers/recent', {
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
