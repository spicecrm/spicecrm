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
    templateUrl: './src/modules/telesales/templates/telesalescockpitheader.html'
})

export class TeleSalesCockpitHeader implements OnInit {

    public fieldsetItems: any[] = [];
    private actionset: string = '';
    private fieldset: string;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private telecockpitservice: telecockpitservice) {
    }

    get campaignTasks(): any[] {
        return this.telecockpitservice.campaigntasks;
    }

    get selectedCampaignTask(): any {
        return this.telecockpitservice.selectedCampaignTask;
    }

    public ngOnInit() {
        this.loadComponentConfigs();
    }

    private loadComponentConfigs() {
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitHeader');
        this.actionset = conf && conf.actionset ? conf.actionset : '';
        this.fieldset = conf && conf.fieldset ? conf.fieldset : undefined;
        if (this.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(this.fieldset);
        }
    }

    private selectCampaignTask(value) {
        this.telecockpitservice.selectedCampaignTask = value;
        this.telecockpitservice.resetMainView();
    }

    private getCampaigntaskDisplay(campaignTask) {
        let campaignName = campaignTask.campaign_name && campaignTask.campaign_name.length > 0 ? (campaignTask.campaign_name + ' / ') : '';
        return campaignName + campaignTask.name;
    }

    private trackByFn(index, item) {
        return item.item_id;
    }
}
