/**
 * @module ModuleProjects
 */
import {AfterViewInit, Component, effect, OnInit, QueryList, ViewChildren} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {SystemModelProviderDirective} from "../../../directives/directives/systemmodelprovider";
import {asapScheduler} from "rxjs";

@Component({
    selector: 'project-activity-elements',
    templateUrl: '../templates/projectactivityelements.html',
    standalone: false,
    providers: [relatedmodels, view]
})
export class ProjectActivityElements implements OnInit {

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
        this.relatedmodels.loaditems = -99;
    }

    /**
     * loads the activity related elements and selects them all
     */
    public loadActivityElements() {
        this.relatedmodels.id = this.projectwbshierarchy.project_id();
        this.relatedmodels.getData().subscribe({
            next: () => {
                asapScheduler.schedule(() => this.selectAll(), 10)
            }
        })
    }

    public selectAll(): void {
        this.selectedItems = new Map(
            this.projectActivityModels.map(m => ([m.model.id, m.model]))
        )
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
    }

    public goDetail(itemId: string) {
        let foundModel = this.projectActivityModels.find(activity => activity.model.id === itemId)
        foundModel.model.edit(true);
    }

    public handleSave() {
        this.relatedmodels.getData();
        this.selectedItems = new Map();
    }
}