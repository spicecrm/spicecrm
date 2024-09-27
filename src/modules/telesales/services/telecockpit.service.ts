/**
 * @module ModuleTeleSales
 */
import {Injectable, OnDestroy} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Subject, Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {view} from "../../../services/view.service";

declare var moment;

@Injectable()

export class telecockpitservice implements OnDestroy {

    public isloading: boolean = false;
    public canLoadMore: boolean = true;
    public listItems: any[] = [];
    public campaigntasks: any[] = [];
    public selectedcampaigntask: any = {};
    public selectedListItem: any;
    public selectedItemSubject: Subject<any> = new Subject<any>();
    public renderedMainComponents: any[] = [];
    private subscription = new Subscription();

    /**
     * holds the stats
     */
    public campaignTaskStats: any = {};

    constructor(public backend: backend,
                public metadata: metadata,
                private broadcast: broadcast,
                private view: view,
                public language: language) {
        this.getCampaignTasks();
        this.subscribeToModelChanges();
    }

    get loadLimit() {
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitList');
        return conf && conf.limit ? conf.limit : 50;
    }

    get selectedCampaignTask() {
        return this.selectedcampaigntask;
    }

    set selectedCampaignTask(value) {
        this.loadData(value.id);
        this.selectedListItem$ = undefined;
        this.selectedcampaigntask = value;
    }

    get selectedListItem$() {
        return this.selectedItemSubject.asObservable();
    }

    set selectedListItem$(value: any) {
        this.selectedListItem = value;
        this.selectedItemSubject.next(value);
    }

    public isLocked(item?: any, checkOwner?: boolean) {
        if (!item) item = this.selectedListItem;
        return moment(item.locked_until).isAfter(moment()) && (!checkOwner || item.locked_by_id != this.metadata.session.authData.user.id);
    }

    private subscribeToModelChanges() {
        this.subscription.add(
            this.broadcast.message$.subscribe({
                next: (msg) => {
                    if (msg.messagetype != 'model.save') return;

                    if (msg.messagedata.module == 'CampaignLog') {

                        const itemIdx = this.listItems.findIndex(i => i.id == msg.messagedata.id);

                        if (itemIdx > -1 && (moment(msg.messagedata.data.planned_activity_date).isAfter(moment()) || (msg.messagedata.data.activity_type in {completed: 1, converted: 1, maxattempts: 1}))) {
                            this.listItems.splice(itemIdx, 1);
                        } else if(itemIdx >-1){
                            this.listItems[itemIdx].target_type = msg.messagedata.data.target_type;
                            this.listItems[itemIdx].hits = msg.messagedata.data.hits;
                            this.listItems[itemIdx].activity_date = msg.messagedata.data.activity_date;
                            this.listItems[itemIdx].activity_type = msg.messagedata.data.activity_type;
                            this.listItems[itemIdx].related_id = msg.messagedata.data.related_id;
                            this.listItems[itemIdx].planned_activity_date = msg.messagedata.data.planned_activity_date;
                            this.listItems[itemIdx].planned_activity_user_id = msg.messagedata.data.planned_activity_user_id;
                            this.listItems[itemIdx].locked_until = msg.messagedata.data.locked_until;
                            this.listItems[itemIdx].locked_by_id = msg.messagedata.data.locked_by_id;
                        }

                    } else {

                        const itemIdx = this.listItems.findIndex(i => i.target_type == msg.messagedata.module && i.data.id == msg.messagedata.id);

                        if (itemIdx == -1) return;

                        this.listItems[itemIdx] = {...this.listItems[itemIdx], data: msg.messagedata.data};
                    }
                }
            })
        )
    }

    public getCampaignTasks() {
        let fields = JSON.stringify(["name", "start_date", "end_date", "status", "campaigntask_type", "campaign_name", "campaign_id"]);
        let conf = this.metadata.getComponentConfig('TeleSalesCockpit');
        let modulefilter = conf && conf.modulefilter ? conf.modulefilter : {};
        let params = {fields, modulefilter};
        this.backend.getRequest("module/CampaignTasks", params).subscribe(response => {
            this.campaigntasks = response.list.sort((a, b) => a.name > b.name ? 1 : -1);
            if (response.list.length > 0) {
                this.selectedCampaignTask = this.campaigntasks[0];
            }
        });
    }

    public loadData(id) {
        this.listItems = [];
        this.campaignTaskStats = [];
        this.isloading = true;
        this.canLoadMore = true;

        let params = {limit: this.loadLimit};

        this.backend.getRequest("module/CampaignTasks/" + id + "/items", params).subscribe({
            next: (response) => {
                for (let item of response.items) {
                    this.listItems.push(
                        this.generateItemObject(item)
                    );
                }

                // set the stats
                this.campaignTaskStats = response.stats;

                // set loading to false
                this.isloading = false;

                if (this.listItems.length < this.loadLimit) {
                    this.canLoadMore = false;
                }
            }
        });

    }

    public loadMoreData() {

        if (this.isloading || !this.canLoadMore) {
            return false;
        }
        this.isloading = true;
        let params = {offset: this.listItems.length, limit: this.loadLimit};

        this.backend.getRequest("module/CampaignTasks/" + this.selectedCampaignTask.id + "/items", params)
            .subscribe(response => {
                for (let item of response.items) {
                    this.listItems.push(
                        this.generateItemObject(item)
                    );
                }

                if (response.items.length < this.loadLimit) {
                    this.canLoadMore = false;
                }

                this.isloading = false;
            });
    }

    private generateItemObject(item) {
        return {
            id: item.campaignlog_id,
            target_type: item.campaignlog_target_type,
            hits: item.campaignlog_hits,
            activity_date: item.campaignlog_activity_date,
            activity_type: item.campaignlog_activity_type,
            related_id: item.campaignlog_related_id,
            planned_activity_date: item.campaignlog_planned_activity_date,
            planned_activity_user_id: item.campaignlog_planned_activity_user_id,
            locked_until: item.campaignlog_locked_until,
            locked_by_id: item.campaignlog_locked_by_id,
            data: item.data
        }
    }

    /**
     * load the stats only
     */
    public loadStats(){
        this.backend.getRequest("module/CampaignTasks/" + this.selectedCampaignTask.id + "/stats").subscribe({
            next: (response) => {
                // set the stats
                this.campaignTaskStats = response.stats;
            }
        });
    }

    public resetMainView() {
        this.renderedMainComponents.forEach(component => component.destroy());
        this.renderedMainComponents = [];
    }

    public renderMainView(module, mainContainer) {
        this.resetMainView();
        if (!module) {
            return;
        }
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitMain', module);
        let componentSet = componentconfig.componentset;
        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, mainContainer).subscribe(componentref => {
                    this.renderedMainComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
