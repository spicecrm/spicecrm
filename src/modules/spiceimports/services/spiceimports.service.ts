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
 * @module ModuleSpiceImports
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../../services/backend.service';

@Injectable()

export class spiceimportsservice {

    isloading: boolean = false;
    isloadingLogs: boolean = false;
    canLoadMore: boolean = true;
    activeimportdata: any = undefined;
    activeLogName: string;
    loadLimit = 25;
    activeimportdata$: EventEmitter<any> = new EventEmitter<any>();
    items: Array<any> = [];
    activeItemLogs: Array<any> = undefined;

    constructor(private backend: backend ) {
    }

    get activeImportData() {
        return this.activeimportdata;
    }

    set activeImportData(data) {
        this.activeimportdata = data;
        this.activeimportdata$.emit(data);
    }

    getItemLogs() {
        this.activeItemLogs = undefined;
        this.isloadingLogs = true;

        this.backend.getRequest(`modules/SpiceImports/${this.activeImportData.id}/logs`)
            .subscribe(logs => {
                logs.map(log => log.data = log.data.split('";"'));
                this.activeItemLogs = logs;
                this.isloadingLogs = false;
            });
    }

    loadData() {

        this.isloading = true;

        this.backend.getRequest(
            'module/SpiceImports',
            {orderby: 'date_entered DESC', limit: this.loadLimit, offset: 0, fields: '*'})
            .subscribe(res => {
                this.parseItemsStatus(res.list);
                this.items = res.list;
                this.isloading = false;
            });
    }

    loadMoreData() {

        if (this.isloading || !this.canLoadMore)
            return false;

        this.isloading = true;

        this.backend.getRequest(
            'module/SpiceImports',
            {orderby: 'date_entered DESC', limit: this.loadLimit, offset: this.items.length, fields: '*'})
            .subscribe(res => {
                this.parseItemsStatus(res.list);
                this.items = this.items.concat(res.list);
                if (res.list.length < this.loadLimit)
                    this.canLoadMore = false;

                this.isloading = false;
            });
    }

    deleteImport() {
        this.items.every(item => {
            let itemIndex = this.items.indexOf(item);
            if (item.id == this.activeImportData.id)
                this.items.splice(itemIndex, 1)
            return true;
        });
    }

    parseItemsStatus(items) {
        items.map(item => {
            let data = JSON.parse(item.data);

            switch (item.status) {
                case 'c':
                    if (data.importAction == 'new')
                        item.status ='LBL_IMPORTED';
                    else
                        item.status ='LBL_UPDATED';
                    break;
                case 'e':
                    if (data.importAction == 'new')
                        item.status ='LBL_IMPORTED';
                    else
                        item.status ='LBL_UPDATE_FAILED';
                    break;
                case 'q':
                    item.status ='LBL_SCHEDULED';
                    break;
                default:
                    item.status ='LBL_SCHEDULED';
                    break;
            }
            return item;
        });
    }

}
