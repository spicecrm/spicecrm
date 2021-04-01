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
 * @module ModuleReportsMore
 */
import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../../../modules/reports/services/reporterconfig';

/**
 * renders the modal with the query generated
 */
@Component({
    selector: 'reporter-integration-queryanalyzer-modal',
    templateUrl: './src/modules/reportsmore/templates/reporterintegrationqueryanalyzermodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterIntegrationQueryanalyzerModal implements OnInit {

    /**
     * reference to the modal self
     */
    private self: any = {};

    /**
     * the main query
     */
    private mainquery: string = '';

    /**
     * the formatte query
     */
    private formattedquery: string = '';

    /**
     * the formatte query
     */
    private highlightedquery: string = '';

    /**
     * indicates that the data is not yet loaded
     */
    private loading: boolean = true;

    /**
     * matching the retunrs tbales from the quirked query to real names
     */
    private tabledictionary: any = {};

    private _translateTableNames: boolean = false;

    constructor(private language: language, private backend: backend, private sanitizer: DomSanitizer, private reporterconfig: reporterconfig, private model: model, private toast: toast, private cdRef: ChangeDetectorRef) {
    }

    /**
     * load the query from the backend for the report
     */
    public ngOnInit() {

        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }
        let postBody = {
            record: this.model.id,
            whereOverride: JSON.stringify(whereConditions)
        }
        this.backend.postRequest('KReporter/plugins/kqueryanalizer/get_sql', {}, postBody).subscribe(sql => {
                this.mainquery = sql.main;
                this.formattedquery = sql.formatted;
                this.highlightedquery = sql.highlighted;
                this.loading = false;

                this.extractTableNames();

                this.cdRef.detectChanges();
            },
            error => {
                this.loading = false;

                this.cdRef.detectChanges();
            });
    }

    /**
     * a getter for the formatted query, domSanitized
     */
    get queryformatted() {
        if (this.highlightedquery != '') {
            let query = this.highlightedquery;

            if (this.translateTableNames) {
                for (let tablename in this.tabledictionary) {

                    let rx = new RegExp(tablename, 'g');
                    query = query.replace(rx, this.tabledictionary[tablename]);
                }
            }

            return this.sanitizer.bypassSecurityTrustHtml(query);
        }
    }

    get translateTableNames() {
        return this._translateTableNames;
    }

    set translateTableNames(value) {
        this._translateTableNames = value;
        this.cdRef.detectChanges();
    }

    /**
     * close the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * copy the SQL to clipboard
     */
    private copy2clipboard() {
        let query = this.formattedquery;

        if (this.translateTableNames) {
            for (let tablename in this.tabledictionary) {

                let rx = new RegExp(tablename, 'g');
                query = query.replace(rx, this.tabledictionary[tablename]);
            }
        }

        navigator.clipboard.writeText(query).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }

    /**
     * builds the table dictionary
     */
    private extractTableNames() {
        // kes a counter for the tables to have the tables numbered if the occur multiple times
        let tablecounter = {};

        // reset the current mapping
        this.tabledictionary = {};

        // remove all double whitepaces
        this.mainquery = this.mainquery.replace(/  +/g, ' ');

        // fnd the matchs and
        let matches = this.mainquery.match(/FROM\s*[a-z_]*\s[a-z]*/gm).concat(this.mainquery.match(/JOIN\s*[a-z_]*\s[a-z]*/gm));
        for (let match of matches) {
            if(!match) continue;
            let clausArray = match.split(' ');
            if (clausArray.length == 3) {
                let tablename = clausArray[1];
                if (tablecounter[tablename] != undefined) {
                    tablecounter[tablename]++;
                } else {
                    tablecounter[tablename] = 0;
                }
                this.tabledictionary[clausArray[2]] = tablename + tablecounter[tablename];
            }
        }
    }
}
