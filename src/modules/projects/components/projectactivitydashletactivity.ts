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
    private activityminutes: number = 15;
    private activitiyhours: number = 0;

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
            return e.project_name.toLowerCase().includes(this.wbs_search_term) || e.name.toLowerCase().includes(this.wbs_search_term) || e.type.toLowerCase().includes(this.wbs_search_term) || e.level.toLowerCase().includes(this.wbs_search_term);
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
            let endDate = moment(this.model.data.activity_start);
            endDate.add(this.activityminutes, "m");
            endDate.add(this.activitiyhours, "h");
            this.model.setField('activity_end', endDate);

        } else if (Math.round(moment.duration(data.activity_end.diff(data.activity_start)).asMinutes()) != (this.activitiyhours * 60 + this.activityminutes)) {
            // set end date to start date (without setting the time...)
            if (!this.model.data.activity_start) {
                return false;
            }

            this.model.data.activity_end
                .year(this.model.data.activity_start.get("year"))
                .month(this.model.data.activity_start.get("month"))
                .date(this.model.data.activity_start.get("date"));

            // calculate the duration in minutes
            let duration = Math.round(moment.duration(data.activity_end.diff(data.activity_start)).asMinutes());

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
        let value = new moment();
        value.minute((Math.floor(value.minute() / 15) + 1) * 15);
        this.model.data.activity_end = value;
        this.model.data.activity_end.second(0);

        // set default duration to 15 minutes
        this.model.data.duration_hours = 0;
        this.model.data.duration_minutes = 15;

        this.activitiyhours = 0;
        this.activityminutes = 15;

        // set the date start subtracting the duration
        this.model.data.activity_start = new moment(value);
        this.model.data.activity_start.second(0);
        this.model.data.activity_start.subtract(this.model.data.duration_minutes, "m");
    }
}
