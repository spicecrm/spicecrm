import {Component} from "@angular/core";
import {model} from "../../services/model.service";
import {userpreferences} from "../../services/userpreferences.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "./fieldgeneric";
import {session} from "../../services/session.service";

declare var moment: any;

/**
 * documentation: writes a log (json), only 1 entry per save allowed
 * created by Sebastian Franz
 */
@Component({
    selector: "field-worklog",
    templateUrl: "./src/objectfields/templates/fieldworklog.html"
})
export class fieldWorklog extends fieldGeneric {
    private _new_log_entry: string;
    private origin_logs = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private session: session,
        public userpreferences: userpreferences
    ) {
        super(model, view, language, metadata, router);
        // in case edit modal is opened... and the view is already in edit mode...
        if (this.view.isEditMode()) {
            this.view.mode$.subscribe(
                (mode) => {
                    if (mode == "edit") {
                        this.origin_logs = this.logs;
                    }
                }
            );
        }
    }

    public ngOnInit() {
        super.ngOnInit();
        if (this.view.isEditMode()) {
            this.origin_logs = this.logs;
        }
    }

    get logs() {
        if (this.value) {
            if (typeof this.value == "string") {
                return JSON.parse(this.value);
            } else {
                return this.value;
            }
        } else {
            return [];
        }
    }

    set logs(val) {
        if (this.field_defs.type != "json") {
            this.value = JSON.stringify(val);
        } else {
            this.value = val;
        }
    }

    set new_log_entry(val) {
        this._new_log_entry = val;
        let new_logs = [...this.origin_logs];
        new_logs.unshift(
            {
                timestamp: +new Date(),
                user_name: this.session.authData.userName,
                user_id: this.session.authData.userId,
                text: val,
            }
        );
        this.logs = new_logs;
    }

    get styles() {
        let styles = {
            height: this.fieldconfig.height ? this.fieldconfig.height + "px" : "200px"
        };
        return styles;
    }

    private formatTimestamp(ts) {
        let mts = moment(ts);
        return this.userpreferences.formatDateTime(mts);
    }
}
