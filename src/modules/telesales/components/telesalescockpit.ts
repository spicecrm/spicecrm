/**
 * @module ModuleTeleSales
 */
import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {Subscription} from "rxjs";
import {TeleSalesCockpitMain} from "./telesalescockpitmain";
import {TeleSalesCockpitList} from "./telesalescockpitlist";

@Component({
    templateUrl: './src/modules/telesales/templates/telesalescockpit.html',
    providers: [
        telecockpitservice,
        view,
        model
    ]
})

export class TeleSalesCockpit implements OnInit, OnDestroy {

    @ViewChild('scrollcontainer', {read: ViewContainerRef}) scrollContainer: ViewContainerRef;
    @ViewChild(TeleSalesCockpitMain) mainComponent: TeleSalesCockpitMain;
    @ViewChild(TeleSalesCockpitList) private listComponent: TeleSalesCockpitList;

    private actionset: string = '';
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private telecockpitservice: telecockpitservice) {
        this.subscription = this.telecockpitservice.selectedListItem$.subscribe(listItem => this.loadModel(listItem));
    }

    get campaignTasks() {
        return this.telecockpitservice.campaigntasks;
    }

    get selectedCampaignTask() {
        return this.telecockpitservice.selectedCampaignTask;
    }

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpit');
        this.actionset = componentconfig && componentconfig.actionset ? componentconfig.actionset : '';
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private selectCampaignTask(value) {
        this.telecockpitservice.selectedCampaignTask = value;
        this.mainComponent.resetView();
    }

    private getCampaigntaskDisplay(campaignTask) {
        let campaignName = campaignTask.campaign_name && campaignTask.campaign_name.length > 0 ? (campaignTask.campaign_name + ' / ') : '';
        return campaignName + campaignTask.name;
    }

    private loadModel(modelData) {
        this.model.reset();
        if (!modelData) {
            return;
        }
        this.model.module = modelData.target_type;
        this.model.id = modelData.data.id;
        this.model.data = modelData.data;
    }

    private trackByFn(index, item) {
        return item.item_id;
    }
}
