/**
 * @module ModuleProjects
 */
import {Component, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: "project-activity-dashlet",
    templateUrl: "./src/modules/projects/templates/projectactivitydashlet.html",
    providers: [model, view]
})
export class ProjectActivityDashlet implements OnInit {
    private _wbss: Array<any> = [];
    private selected_wbs = null;
    private _wbs_search_term = "";
    private show_wbs_results = false;
    private activityminutes: number = 15;
    private activitiyhours: number = 0;
    private recent_project_activities = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view,
        private backend: backend,
        private toast: toast,
    ) {
        this.model.module = "ProjectActivities";

        // do a reset and initialize
        this.reset();

        this.view.isEditable = true;
        this.view.setEditMode();

        this.model.data$.subscribe(modeldata => {this.modelchanged(modeldata);});
    }

    public ngOnInit() {
        // load the last activities entered
        this.loadRecentActivities();


        this.backend.getRequest("projectwbs/my/wbss").subscribe(wbss => {
            this._wbss = wbss;
        });
    }

    set wbs_search_term(val)
    {
        this._wbs_search_term = val.toLowerCase();
        if( val || val === "" ) {
            this.show_wbs_results = true;
        } else {
            this.show_wbs_results = false;
        }
    }

    get wbs_search_term()
    {
        return this._wbs_search_term;
    }

    get wbss()
    {
        if( !this._wbs_search_term ) {
            return this._wbss;
        }

        return this._wbss.filter((e) => {
            return e.project_name.toLowerCase().includes(this._wbs_search_term) || e.name.toLowerCase().includes(this._wbs_search_term) || e.type.toLowerCase().includes(this._wbs_search_term) || e.level.toLowerCase().includes(this._wbs_search_term);
        });
    }

    private modelchanged(data)
    {
        if (this.activityminutes != data.duration_minutes || this.activitiyhours != data.duration_hours){
            // set the new values
            this.activityminutes = data.duration_minutes;
            this.activitiyhours = data.duration_hours;

            // calculate the end date
            this.model.data.activity_end = moment(this.model.data.activity_start);
            this.model.data.activity_end.add(this.activityminutes, "m");
            this.model.data.activity_end.add(this.activitiyhours, "h");

        } else if ( Math.round(moment.duration(data.activity_end.diff(data.activity_start)).asMinutes()) != (this.activitiyhours * 60 + this.activityminutes)){
            // set end date to start date (without setting the time...)
            if(!this.model.data.activity_start)
                return false;

            this.model.data.activity_end
                .year(this.model.data.activity_start.get("year"))
                .month(this.model.data.activity_start.get("month"))
                .date(this.model.data.activity_start.get("date"));

            // calculate the duration in minutes
            let duration = Math.round(moment.duration(data.activity_end.diff(data.activity_start)).asMinutes());

            // get minutes and hours
            if(duration > 0)
            {
                this.activitiyhours = Math.floor(duration / 60);
                this.activityminutes = duration - (this.activitiyhours * 60);
            }
            else{
                this.activitiyhours = Math.ceil(duration / 60);
                this.activityminutes = duration + (this.activitiyhours * 60);
            }

            // set the model data
            this.model.data.duration_hours = this.activitiyhours;
            this.model.data.duration_minutes = this.activityminutes;

        }
    }

    private validate()
    {
        if( !this.selected_wbs )
            return false;

        if( this.model.data.duration_hours < 1 && this.model.data.duration_minutes < 1 )
            return false;
        if( this.model.data.duration_hours < 0 || this.model.data.duration_minutes < 0 )
            return false;

        if( !this.model.data.name )
            return false;

        return true;
    }

    private save() {
        if( !this.validate() ) {
            return false;
        }

        this.model.data.projectwbs_id = this.selected_wbs.id;
        this.model.data.activity_type = this.selected_wbs.type;
        this.model.data.activity_level = this.selected_wbs.level;

        this.model.save().subscribe(saved => {
            this.reset();
            this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success" );
            this.loadRecentActivities();
        });
    }

    private loadRecentActivities(cnt = 5) {
        this.backend.all(
            this.model.module,
            {
                limit: cnt,
                listid: "owner",
                sortfield: "date_entered",
                sortdirection: "desc",
            }
        ).subscribe(
            (res) => {
                this.recent_project_activities = res;
            }
        );
    }

    private reset() {
        this.model.id = "";
        this.model.initializeModel();

        this.selected_wbs = null;
        this._wbs_search_term = null;
        this.show_wbs_results = false;

        // set to the next 15  minute to the end
        let value = new moment();
        value.minute((Math.floor(value.minute()/15)+1)*15);
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
