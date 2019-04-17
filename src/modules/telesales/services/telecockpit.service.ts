/**
 * @module ModuleTeleSales
 */
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Subject} from "rxjs";

@Injectable()

export class telecockpitservice {

    public isloading: boolean = false;
    public canLoadMore: boolean = true;
    public listItems: any[] = [];
    public campaigntasks: any[] = [];
    public selectedcampaigntask: any = {};
    public selectedListItem: any;
    public selectedItemSubject: Subject<any> = new Subject<any>();
    private renderedMainComponents: any[] = [];

    constructor(private backend: backend, private metadata: metadata, private language: language) {
        this.getCampaignTasks();
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

    set selectedListItem$(value) {
        this.selectedListItem = value;
        this.selectedItemSubject.next(value);
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
        this.isloading = true;
        this.canLoadMore = true;
        if (!id) {
            return;
        }
        let params = {limit: this.loadLimit};

        this.backend.getRequest("module/CampaignTasks/" + id + "/items", params)
            .subscribe(response => {
                for (let item of response.items) {
                    this.listItems.push({
                        id: item.campaignlog_id,
                        target_type: item.campaignlog_target_type,
                        hits: item.campaignlog_hits,
                        activity_date: item.campaignlog_activity_date,
                        activity_type: item.campaignlog_activity_type,
                        related_id: item.campaignlog_related_id,
                        planned_activity_date: item.campaignlog_planned_activity_date,
                        data: item.data
                    });
                }

                this.isloading = false;

                if (this.listItems.length < this.loadLimit) {
                    this.canLoadMore = false;
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
                    this.listItems.push({
                        id: item.campaignlog_id,
                        target_type: item.campaignlog_target_type,
                        hits: item.campaignlog_hits,
                        activity_date: item.campaignlog_activity_date,
                        activity_type: item.campaignlog_activity_type,
                        related_id: item.campaignlog_related_id,
                        planned_activity_date: item.campaignlog_planned_activity_date,
                        data: item.data
                    });
                }

                if (response.items.length < this.loadLimit) {
                    this.canLoadMore = false;
                }

                this.isloading = false;
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
}
