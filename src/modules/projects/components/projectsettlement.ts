/**
 * @module ModuleProjects
 */
import {
    Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Params, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {layout} from '../../../services/layout.service';
import {backend} from '../../../services/backend.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * renders a list of activities on a WSB tio be settled
 */
@Component({
    templateUrl: './src/modules/projects/templates/projectsettlement.html',
    providers: [model]
})
export class ProjectSettlement implements OnInit {

    /**
     * indicates when we are loading
     *
     * @private
     */
    private loading: boolean = false;

    /**
     * the componentconfig
     *
     * @private
     */
    private componentconfig: any;

    /**
     * the prohect activities loaded from teh backend
     *
     * @private
     */
    private projectActivities: any[] = [];

    /**
     * the activity types loaded
     *
     * @private
     */
    private projectActivityTypes: any[] = [];

    /**
     * the planned activities loaded
     *
     * @private
     */
    private projectPlannedActivities: any[] = [];

    /**
     * the WBS elements laoded to settle
     *
     * @private
     */
    private projectWBSs: any[] = [];

    constructor(
        private metadata: metadata,
        private modelutilities: modelutilities,
        private backend: backend,
        private parent: model,
        private language: language,
        private navigationtab: navigationtab,
        private layout: layout,
        private router: Router
    ) {
    }

    public ngOnInit(): void {
        // initialize the tab
        this.initialize(this.navigationtab.activeRoute.params);
    }


    /**
     * initializes when the activated Route returns the promise in the constructor
     *
     * @param params the Route Params returned
     */
    private initialize(params: Params) {
        // get the bean details
        this.parent.module = 'Projects';
        this.parent.id = params.id;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.navigationtab.setTabInfo({
                displayname: this.parent.getField('summary_text') + ' • ' + this.language.getLabel('LBL_SETTLEMENT'),
                displaymodule: 'ProjectWBSs'
            });

            this.loadUnsettledActivities();
        });
    }

    /**
     * loads the unsettled activities
     *
     * @private
     */
    private loadUnsettledActivities(){
        this.loading = true;
        this.backend.getRequest(`module/Projects/${this.parent.id}/unsettletactivities`).subscribe(
            activities => {
                this.loading = false;
                this.projectActivities = activities.ProjectActivities;

                // fill up the activities
                for (let projectActivity of this.projectActivities) {
                    projectActivity = this.modelutilities.backendModel2spice('ProjectActivities', projectActivity);
                    projectActivity.selected = true;
                }

                // sort the activities
                this.projectActivities.sort((a, b) => a.activity_start.isBefore(b.activity_end) ? -1 : 1);

                // fill up the rest
                this.projectPlannedActivities = activities.ProjectPlannedActivities;
                this.projectActivityTypes = activities.ProjectActivityTypes;
                this.projectWBSs = activities.ProjectWBSs;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * returns the activities per Project
     *
     * @param projectWBS
     * @private
     */
    private projectWBSActivities(projectWBS){
        let plannedactivityIDs = this.projectPlannedActivities.filter(p => p.projectwbs_id == projectWBS.id).map(p => p.id);
        return this.projectActivities.filter(a => plannedactivityIDs.indexOf(a.projectplannedactivity_id) >=0);
    }

    /**
     * returns the total
     *
     * @param projectWBS
     * @private
     */
    private projectWBSTotalSettlmentEffort(projectWBS){
        let total = 0;
        let plannedactivityIDs = this.projectPlannedActivities.filter(p => p.projectwbs_id == projectWBS.id).map(p => p.id);
        for(let activity of this.projectActivities.filter(a => plannedactivityIDs.indexOf(a.projectplannedactivity_id) >=0)){
            if(activity.selected && activity.settlement_type == 'regular'){
                total += activity.corrected_duration ? activity.corrected_duration : activity.activity_duration;
            }
        }

        let ret = {
            total: total,
            hours: Math.floor(total / 3600),
            minutes: (total - (Math.floor(total / 3600) * 3600)) / 60,
            display: ''
        }

        ret.display = ret.hours + ':' + (ret.minutes < 10 ? '0'+ret.minutes : ret.minutes);
        return ret;
    }

    /**
     * cheks that at least one item is selected
     */
    get canSettle(){
        return this.projectActivities.filter(a => a.selected).length > 0;
    }

    /**
     * run the settlement
     *
     * @private
     */
    private settle() {
        this.backend.postRequest(`module/Projects/${this.parent.id}/settletactivities`, {}, this.projectActivities.filter(a => a.selected)).subscribe(
            res => {
                if (res.saledocid) {
                    this.router.navigate([`/tab/${this.navigationtab.tabid}/module/SalesDocs/${res.saledocid}`]);
                }
            }
        );
    }

    /**
     * calculates the duration in hours
     *
     * @param start
     * @param end
     * @private
     */
    private getDurationHours(start, end) {
        return Math.round(end.diff(start, 'hours', true) * 100) / 100;
    }

    /**
     * track by function for the list for performance
     *
     * @param i
     * @param item
     */
    private trackByFn(i, item) {
        return item.id;
    }

}
