/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleProjects
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modellist} from '../../../services/modellist.service';
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "project-activity-dashlet-activity",
    templateUrl: "./src/modules/projects/templates/projectactivitydashletactivity.html",
    providers: [model, view]
})
export class ProjectActivityDashletActivity implements OnInit, OnDestroy {

    /**
     * the list with the planned activities as retrieved from the backend
     *
     * @private
     */
    private plannedActivities: any = [];
    private selected_wbs = null;
    private wbs_search_term = "";
    private show_wbs_results = false;

    // the current set minutes
    private activityminutes: number = 15;

    // the currrent set hours
    private activitiyhours: number = 0;

    private activitiyDateStart: any;
    private activitiyDateEnd: any;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view,
        private backend: backend,
        private toast: toast,
        private modellist: modellist
    ) {
        this.view.displayLabels = false;
        this.model.module = "ProjectActivities";

        // do a reset and initialize
        this.reset();

        this.view.isEditable = true;
        this.view.setEditMode();

        this.subscriptions.add(
            this.model.data$.subscribe(modeldata => {
                this.modelchanged(modeldata);
            })
        );

    }

    /**
     * initialize and load the planned activities available
     */
    public ngOnInit() {
        // load wbss
        this.backend.getRequest("module/ProjectPlannedActivities/my/open").subscribe(plannedActivities => {
            this.plannedActivities = plannedActivities;
        });
    }

    /**
     * unsubscribe from all active subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * getter for the filtered activities
     */
    get activities() {
        if (!this.wbs_search_term) {
            return this.plannedActivities;
        }

        return this.plannedActivities.filter((e) => {
            return e.summary_text.toLowerCase().includes(this.wbs_search_term);
        });
    }

    /**
     * listener to model changes
     * @param data
     * @private
     */
    private modelchanged(data) {
        if (this.activityminutes != data.duration_minutes || this.activitiyhours != data.duration_hours) {
            // set the new values
            this.activityminutes = data.duration_minutes;
            this.activitiyhours = data.duration_hours;

            // calculate the end date
            this.activitiyDateEnd = moment(this.model.data.activity_start);
            this.activitiyDateEnd.add(this.activityminutes, "m");
            this.activitiyDateEnd.add(this.activitiyhours, "h");

            this.model.setField('activity_end', this.activitiyDateEnd);

        } else if (data.activity_start && Math.round(moment.duration(data.activity_start.diff(this.activitiyDateStart)).asMinutes()) != 0) {
            // set the current date start so we have a reference for changes
            this.activitiyDateStart = new moment(data.activity_start);
            // calculate a new end date with the new duration
            this.activitiyDateEnd = moment(this.model.data.activity_start);
            this.activitiyDateEnd.add(this.activityminutes, "m");
            this.activitiyDateEnd.add(this.activitiyhours, "h");

            this.model.setField('activity_end', this.activitiyDateEnd);
        } else if (data.activity_end && Math.round(moment.duration(data.activity_end.diff(data.activity_start)).asMinutes()) < 0) {
            // we have a new end date before the start date .. this is not allowed .. reset the end time
            this.model.setField('activity_end', this.activitiyDateEnd);
        } else if (data.activity_end && Math.round(moment.duration(data.activity_end.diff(this.activitiyDateEnd)).asMinutes()) != 0) {
            // calculate a new duration based on the new end
            this.activitiyDateEnd = moment(this.model.data.activity_end);
            let duration = Math.round(moment.duration(this.model.data.activity_end.diff(data.activity_start)).asMinutes());
            // get minutes and hours
            if (duration > 0) {
                this.activitiyhours = Math.floor(duration / 60);
                this.activityminutes = duration - (this.activitiyhours * 60);
            } else {
                this.activitiyhours = Math.ceil(duration / 60);
                this.activityminutes = duration + (this.activitiyhours * 60);
            }

            // set the model data
            this.model.setFields({
                duration_hours: this.activitiyhours,
                duration_minutes: this.activityminutes,
            });
        }
    }

    /**
     * validate if we can save
     *
     * @private
     */
    private validate() {
        if (!this.selected_wbs) {
            return false;
        }

        if (this.model.data.duration_hours < 1 && this.model.data.duration_minutes < 1) {
            return false;
        }
        if (this.model.data.duration_hours < 0 || this.model.data.duration_minutes < 0) {
            return false;
        }

        if (!this.model.data.name) {
            return false;
        }

        /**
         * needs to be on the same day
         */
        if (this.model.data.activity_start.dayOfYear() != this.model.data.activity_end.dayOfYear()) {
            return false;
        }

        return true;
    }

    /**
     * saves the record
     *
     * @private
     */
    private save() {
        if (!this.validate()) {
            return false;
        }

        let modelData = {
            projectwbs_id: this.selected_wbs.projectwbs_id,
            projectplannedactivity_id: this.selected_wbs.id,
            projectactivitytype_id: this.selected_wbs.projectactivitytype_id,
            activity_type: this.selected_wbs.type,
            activity_level: this.selected_wbs.level,
        };

        this.model.setFields(modelData);

        this.model.save().subscribe(saved => {
            this.reset();
            this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success");
        });
    }

    /**
     * resets the component and reinitalizes the model
     *
     * @private
     */
    private reset() {
        this.model.id = "";
        this.model.initializeModel();

        this.selected_wbs = null;
        this.wbs_search_term = null;
        this.show_wbs_results = false;

        // set to the next 15  minute to the end
        this.activitiyDateStart = new moment();
        this.activitiyDateStart.minute((Math.floor(this.activitiyDateStart.minute() / 15)) * 15);
        this.activitiyDateStart.second(0);

        // set default duration to 15 minutes
        this.activitiyhours = 0;
        this.activityminutes = 15;

        // calculate the end date
        this.activitiyDateEnd = new moment(this.activitiyDateStart);
        this.activitiyDateEnd.add(this.activityminutes, 'm');

        // set the model data
        this.model.setFields({
            activity_start: new moment(this.activitiyDateStart),
            activity_end: new moment(this.activitiyDateEnd),
            duration_hours: this.activitiyhours,
            duration_minutes: this.activityminutes
        });
    }
}
