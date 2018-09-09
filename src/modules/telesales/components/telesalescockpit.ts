import {Component, Input, HostBinding, ViewContainerRef, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    templateUrl: './src/modules/telesales/templates/telesalescockpit.html',
    providers: [
        telecockpitservice,
        view,
        model
    ]
})
export class TeleSalesCockpit implements OnInit, AfterViewInit {

    @ViewChild('telecockpitactionscontainer', {read: ViewContainerRef}) telecockpitactionscontainer: ViewContainerRef;
    @ViewChild('telecockpitscrollcontainer', {read: ViewContainerRef}) telecockpitscrollcontainer: ViewContainerRef;

    componentconfig: any = {};
    actionset: string = '';
    campaigntasks: Array<any> = [];
    actionitems: any;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private backend: backend,
                private telecockpitservice: telecockpitservice) {

        let fields = JSON.stringify(["name", "start_date", "end_date", "status", "campaigntask_type", "campaign_name", "campaign_id"]);
        this.backend.getRequest("module/CampaignTasks", {fields: fields}).subscribe(response => {
            this.campaigntasks = response.list;
            if (response.list.length > 0) {
                this.telecockpitservice.campaignTaskId = this.campaigntasks[0].id;
            }
        });

        this.telecockpitservice.selectedItem$.subscribe(data => this.loadModel(data));
        this.telecockpitservice.campaignTaskId$.subscribe(id => this.setCampaignData(id));

    }

    setCampaignData(id) {
        for (let campaigntask of this.campaigntasks) {
            if (campaigntask.id == id) {
                this.telecockpitservice.currentCampaignTaskName = campaigntask.campaign_name;
                this.telecockpitservice.currentCampaignId = campaigntask.campaign_id;
            }
        }
    }

    loadModel(modeldata) {
        this.model.module = modeldata.module;
        this.model.id = modeldata.data.id;
        this.model.data = modeldata.data;
    }

    ngOnInit() {
        // get the Componentconfig if not set yet
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpit');

        this.actionset = componentconfig.actionset;
    }

    ngAfterViewInit() {

        this.actionitems = this.metadata.getActionSetItems(this.actionset);

        if (this.actionitems)
            for (let actionitem of this.actionitems) {

                this.metadata.addComponent(actionitem.component, this.telecockpitactionscontainer).subscribe(componentref => {
                    componentref.instance.parent = this.model;
                    componentref.instance['actionconfig'] = actionitem.actionconfig;
                });

            }
    }

}