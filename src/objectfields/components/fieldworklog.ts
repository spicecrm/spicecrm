/**
 * @module ObjectFields
 */
import {Component} from "@angular/core";
import {model} from "../../services/model.service";
import {userpreferences} from "../../services/userpreferences.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "./fieldgeneric";
import {session} from "../../services/session.service";

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

/**
 * documentation: writes a log (json), only 1 entry per save allowed
 * created by Sebastian Franz
 */
@Component({
    selector: "field-worklog",
    templateUrl: "../templates/fieldworklog.html"
})
export class fieldWorklog extends fieldGeneric {
    public _new_log_entry: string;
    public origin_logs = [];
    public initialized = false;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public session: session,
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
            // SPICEUI-223: subscribe for Inline editing
            this.view.mode$.subscribe(
                (mode) => {
                    if (mode == "edit") {
                        this.origin_logs = this.logs;
                    }
                }
            );
            // this.origin_logs = this.logs;
            this.initialized = true;
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

        // SPICEUI-223: check on content. Inline editing won't have any origin:logs loaded
        if(!this.initialized) {
            this.ngOnInit();
        }

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

    public formatTimestamp(ts) {
        let mts = moment(ts);
        return this.userpreferences.formatDateTime(mts);
    }
}
