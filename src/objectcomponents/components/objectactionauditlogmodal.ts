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
 * @module ObjectComponents
 */
import {Component, OnInit, Optional} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

/**
 * renders the modal with the audiot log
 */
@Component({
    selector: "object-action-auditlog-modal",
    templateUrl: "./src/objectcomponents/templates/objectactionauditlogmodal.html"
})
export class ObjectActionAuditlogModal implements OnInit {

    public self: any = null;

    private auditLog: Array<any> = [];
    private loading: boolean = true;
    private moduleFields: Array<any> = [];

    private _userfilter: string = '';
    private _fieldfilter: string = '';

    constructor(private language: language, private metadata: metadata, @Optional() private model: model) {
    }

    get userfilter() {
        return this._userfilter;
    }

    set userfilter(filtervalue) {
        this._userfilter = filtervalue;
        this.loadAuditLog();
    }

    get fieldfilter() {
        return this._fieldfilter;
    }

    set fieldfilter(filtervalue) {
        this._fieldfilter = filtervalue;
        this.loadAuditLog();
    }

    public ngOnInit() {
        // kick off laoding the log
        this.loadAuditLog();

        // get the fields for the module
        for (let field in this.metadata.getModuleFields(this.model.module)) {
            this.moduleFields.push({
                name: field,
                display: this.language.getFieldDisplayName(this.model.module, field)
            });
        }
        // sort the fields by display
        this.moduleFields.sort((a, b) => {
            return a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1;
        });

    }

    private hideAuditLog() {
        this.self.destroy();
    }

    /**
     * load ths audit log for the bean
     */
    private loadAuditLog() {
        if (this.model) {
            this.auditLog = [];
            this.loading = true;
            this.model.getAuditLog({user: this._userfilter, field: this._fieldfilter}).subscribe(
                log => {
                    this.auditLog = log;
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                });
        }
    }
}
