/**
 * @module ModuleProjects
 */
import {Component, effect, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {SystemModelProviderDirective} from "../../../directives/directives/systemmodelprovider";
import {asapScheduler, Subscription} from "rxjs";

@Component({
    selector: 'project-activity-elements',
    templateUrl: '../templates/projectactivityelements.html',
    standalone: false,
    providers: [relatedmodels, view]
})
export class ProjectActivityElements implements OnInit, OnDestroy {

    @ViewChildren(SystemModelProviderDirective) public projectActivityModels: QueryList<SystemModelProviderDirective>;

    /**
     * holds the selected items to be passed away when saving
     */
    public selectedItems = new Map<string, model>();

    /**
     * fieldset fields to be rendered
     */
    public listFields: any[] = [];

    /**
     * filter for the items to be displayed
     */
    public moduleFilter: string = '';

    /**
     * total duration of selected items
     */
    public totalActivityDuration: string = '';

    /**
     * total duration of corrected items
     */
    public totalCorrectedDuration: string = '';

    /**
     * subscription container
     */
    public subscription: Subscription = new Subscription();

    constructor(public model: model,
                public modellist: modellist,
                public view: view,
                public modal: modal,
                public metadata: metadata,
                public projectwbshierarchy: projectwbsHierarchy,
                public relatedmodels: relatedmodels)
    {
        let componentConfig = this.metadata.getComponentConfig('ProjectActivityElements', 'ProjectActivities');
        this.listFields = this.metadata.getFieldSetFields(componentConfig.fieldset);
        this.moduleFilter = componentConfig.modulefilter

        this.view.displayLabels = false;
        this.view.isEditable = true;
        this.view.setEditMode();

        effect(() => {
            if(this.projectwbshierarchy.project_id()) {
                this.loadActivityElements();
            }
        });
    }

    public ngOnInit() {
        this.relatedmodels.module = 'ProjectWBSs';
        this.relatedmodels.relatedModule = 'ProjectActivities';
        this.relatedmodels.modulefilter = this.moduleFilter;
        this.relatedmodels.loaditems = 50;
        this.relatedmodels.sort = {
            sortfield: 'date_entered',
            sortdirection: 'desc'
        }
    }

    public getTotalActivityDuration() {
        let activitySum: number = 0;
        let correctedSum: number = 0;

        this.selectedItems.forEach((item) => {
            activitySum += item.data.activity_duration
            correctedSum += item.data.corrected_duration
        })

        let hours = (sum) => Math.floor(sum / 3600);
        let minutes = (sum) => Math.floor((sum % 3600) / 60);

        this.totalActivityDuration = `${hours(activitySum)}h ${minutes(activitySum)}min`;
        this.totalCorrectedDuration = `${hours(correctedSum)}h ${minutes(correctedSum)}min`;
    }

    /**
     * loads the activity related elements and selects them all
     */
    public loadActivityElements() {
        this.relatedmodels.id = this.projectwbshierarchy.project_id();
        this.relatedmodels.getData().subscribe({
            next: () => {
                asapScheduler.schedule(() => {
                    this.selectAll();
                    this.observeCorrectedDurationField();
                }, 10)
            }
        })
    }

    public observeCorrectedDurationField() {
        // reset the subscription on each load
        this.subscription.unsubscribe();
        this.subscription = new Subscription();

        this.projectActivityModels.forEach(activity => {
            const sub = activity.model.observeFieldChanges('corrected_duration').subscribe({
                next: () => this.getTotalActivityDuration()
            })

            this.subscription.add(sub);
        })
    }

    public selectAll(): void {
        this.selectedItems = new Map(
            this.projectActivityModels.map(m => ([m.model.id, m.model]))
        )

        this.getTotalActivityDuration();
    }

    get allSelected(): boolean {
        return this.relatedmodels.items.length == this.selectedItems.size;
    }

    set allSelected(value: boolean) {
        if (value) {
            this.selectAll();
        } else {
            this.selectedItems = new Map();
        }

        this.getTotalActivityDuration();
    }

    get disableSave(): boolean {
        return this.selectedItems.size == 0;
    }

    public toggleSelected(item) {

        if (this.selectedItems.has(item.id)) {
            this.selectedItems.delete(item.id);
        } else {
            const activityModel = this.projectActivityModels.find(activity => activity.model.id == item.id);
            this.selectedItems.set(item.id, activityModel.model);
        }

        this.getTotalActivityDuration();
    }

    public goDetail(itemId: string) {
        let foundModel = this.projectActivityModels.find(activity => activity.model.id === itemId);
        foundModel.model.edit(true).subscribe({
            next: () => this.getTotalActivityDuration()
        })
    }

    public handleSave() {
        this.relatedmodels.getData().subscribe({
            next: () => {
                asapScheduler.schedule(() => {
                    this.observeCorrectedDurationField();
                }, 10)
            }
        })

        this.selectedItems = new Map();
        this.getTotalActivityDuration();
    }

    public onScroll() {
        if (this.relatedmodels.canloadmore) {
            this.relatedmodels.getMoreData().subscribe({
                next: () => {
                    asapScheduler.schedule(() => {
                        this.selectAll();
                        this.observeCorrectedDurationField();
                    }, 10)
                }
            })
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}