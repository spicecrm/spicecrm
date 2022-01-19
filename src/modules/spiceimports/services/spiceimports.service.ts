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

    constructor(public backend: backend ) {
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

        this.backend.getRequest(`module/SpiceImports/${this.activeImportData.id}/logs`)
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
