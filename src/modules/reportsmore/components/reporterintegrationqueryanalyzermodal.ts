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
    templateUrl: '../templates/reporterintegrationqueryanalyzermodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterIntegrationQueryanalyzerModal implements OnInit {

    /**
     * reference to the modal self
     */
    public self: any = {};

    /**
     * the main query
     */
    public mainquery: string = '';

    /**
     * the formatte query
     */
    public formattedquery: string = '';

    /**
     * the formatte query
     */
    public highlightedquery: string = '';

    /**
     * indicates that the data is not yet loaded
     */
    public loading: boolean = true;

    /**
     * matching the retunrs tbales from the quirked query to real names
     */
    public tabledictionary: any = {};

    public _translateTableNames: boolean = false;

    constructor(public language: language, public backend: backend, public sanitizer: DomSanitizer, public reporterconfig: reporterconfig, public model: model, public toast: toast, public cdRef: ChangeDetectorRef) {
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
//            record: this.model.id,
            whereOverride: JSON.stringify(whereConditions)
        };
        this.backend.postRequest('module/KReports/' + this.model.id + '/plugins/kqueryanalizer/sql', {}, postBody).subscribe(sql => {
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
    public closeModal() {
        this.self.destroy();
    }

    /**
     * copy the SQL to clipboard
     */
    public copy2clipboard() {
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
    public extractTableNames() {
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
