import {Injectable, EventEmitter} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

import {Subject, Observable} from 'rxjs';

declare var moment: any;

@Injectable()
export class telecockpitservice {

    items: Array<any>;
    currentCampaignTaskId;
    currentCampaignId;
    currentCampaignTaskName;
    isloading: boolean = true;
    total: number;
    canLoadMore: boolean = true;
    selectedLogId: string;
    selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    campaignTaskId$: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private metadata: metadata, private language: language) {
    }

    get logId() {
        return this.selectedLogId;
    }

    get loadLimit(){
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitList');
        return conf.limit ? conf.limit: 50;
    }

    set logId(selectedLogId) {

        this.selectedLogId = selectedLogId;

        this.items.some(item => {
            if (item.id == selectedLogId) {
                this.selectedItem$.emit(item);
                return true;
            }
        });
    }

    get getSelectedLogData() {
        for(let item of this.items){
            if (item.id == this.logId) {
                return item;
            }
        }
        return {};
    }


    loadData(id) {

        this.items = [];
        this.isloading = true;
        this.canLoadMore = true;

        this.backend.getRequest("module/CampaignTasks/" + id + "/items", {limit: this.loadLimit})
            .subscribe(response => {
                for (let item of response.items) {
                    this.items.push({
                        module: item.campaignlog_target_type,
                        id: item.campaignlog_id,
                        hits: item.campaignlog_hits,
                        activity_date: item.campaignlog_activity_date,
                        activity_type: item.campaignlog_activity_type,
                        related_id: item.campaignlog_related_id,
                        planned_activity_date: item.campaignlog_planned_activity_date,
                        data: item.data
                    });
                }

                this.isloading = false;

                if (this.items.length < this.loadLimit)
                    this.canLoadMore = false;

            });

    }

    get campaignTaskId() {
        return this.currentCampaignTaskId;
    }

    set campaignTaskId(id) {

        this.loadData(id);
        this.selectedLogId = '';
        this.currentCampaignTaskId = id;
        this.campaignTaskId$.emit(id);
    }

    get campaignTaskName() {
        return this.currentCampaignTaskName;
    }

    set CampaignTaskName(currentCampaignTaskName) {

        this.currentCampaignTaskName = currentCampaignTaskName;
    }


    loadMoreData() {

        if (this.isloading || !this.canLoadMore)
            return false;

        this.isloading = true;

        this.backend.getRequest("module/CampaignTasks/" + this.currentCampaignTaskId + "/items",
            {offset: this.items.length, limit: this.loadLimit})
            .subscribe(response => {
                for (let item of response.items) {
                    this.items.push({
                        module: item.campaignlog_target_type,
                        id: item.campaignlog_id,
                        hits: item.campaignlog_hits,
                        activity_date: item.campaignlog_activity_date,
                        activity_type: item.campaignlog_activity_type,
                        related_id: item.campaignlog_related_id,
                        planned_activity_date: item.campaignlog_planned_activity_date,
                        data: item.data
                    });
                }

                if (response.items.length < this.loadLimit)
                    this.canLoadMore = false;

                this.isloading = false;
            });
    }


}
