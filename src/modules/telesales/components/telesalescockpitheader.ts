/**
 * @module ModuleTeleSales
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele-sales-cockpit-header',
    templateUrl: '../templates/telesalescockpitheader.html'
})

export class TeleSalesCockpitHeader implements OnInit {

    public fieldsetItems: any[] = [];
    public actionset: string = '';
    public fieldset: string;

    constructor(public language: language,
                public model: model,
                public metadata: metadata,
                public telecockpitservice: telecockpitservice) {
    }

    get campaignTasks(): any[] {
        return this.telecockpitservice.campaigntasks;
    }

    get selectedCampaignTask(): any {
        return this.telecockpitservice.selectedCampaignTask;
    }

    get getActionsetId(){
        if(this.telecockpitservice.selectedCampaignTask.telesales_actionset_id){
            return this.telecockpitservice.selectedCampaignTask.telesales_actionset_id;
        }
        return this.actionset;
    }

    public ngOnInit() {
        this.loadComponentConfigs();
    }

    public loadComponentConfigs() {
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitHeader');
        this.actionset = conf && conf.actionset ? conf.actionset : '';
        this.fieldset = conf && conf.fieldset ? conf.fieldset : undefined;
        if (this.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(this.fieldset);
        }
    }

    public selectCampaignTask(value) {
        this.telecockpitservice.selectedCampaignTask = value;
        this.telecockpitservice.resetMainView();
    }

    public getCampaigntaskDisplay(campaignTask) {
        let campaignName = campaignTask.campaign_name && campaignTask.campaign_name.length > 0 ? (campaignTask.campaign_name + ' / ') : '';
        return campaignName + campaignTask.name;
    }

    public trackByFn(index, item) {
        return item.item_id;
    }
}
