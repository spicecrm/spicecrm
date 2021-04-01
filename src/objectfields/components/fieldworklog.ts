/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/objectfields/templates/fieldworklog.html"
})
export class fieldWorklog extends fieldGeneric {
    private _new_log_entry: string;
    private origin_logs = [];
    private initialized = false;

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

    private formatTimestamp(ts) {
        let mts = moment(ts);
        return this.userpreferences.formatDateTime(mts);
    }
}
