/**
 * @module ModuleActivities
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
    templateUrl: '../templates/projectsettlement.html',
    providers: [model, view]
})
export class ProjectSettlement implements OnInit {


    /**
     * the componentconfig
     *
     * @private
     */
    public componentconfig: any;

    public projectActivities: any[] = [];
    public projectActivityTypes: any[] = [];
    public projectPlannedActivities: any[] = [];
    public projectWBSs: any[] = [];

    constructor(
        public metadata: metadata,
        public view: view,
        public modelutilities: modelutilities,
        public backend: backend,
        public parent: model,
        public language: language,
        public navigationtab: navigationtab,
        public layout: layout,
        public router: Router
    ) {
        this.view.displayLabels = false;
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
    public initialize(params: Params) {
        // get the bean details
        this.parent.module = 'Projects';
        this.parent.id = params.id;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.navigationtab.setTabInfo({
                displayname: this.parent.getField('summary_text') + ' • ' + this.language.getLabel('LBL_SETTLEMENT'),
                displaymodule: 'ProjectWBSs'
            });

            this.backend.getRequest(`module/Projects/${this.parent.id}/unsettletactivities`).subscribe(
                activities => {
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
                }
            );
        });
    }

    public settle() {
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
    public getDurationHours(start, end) {
        return Math.round(end.diff(start, 'hours', true) * 100) / 100;
    }

}
