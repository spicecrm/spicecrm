/**
 * @module ModuleReportsMore
 */
import {Component, OnInit} from '@angular/core';
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
    templateUrl: './src/modules/reportsmore/templates/reporterintegrationqueryanalyzermodal.html'
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

    private translateTableNames: boolean = false;

    constructor(private language: language, private backend: backend, private sanitizer: DomSanitizer, private reporterconfig: reporterconfig, private model: model, private toast: toast) {
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
            },
            error => {
                this.loading = false;
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
        navigator.clipboard.writeText(this.mainquery).then(success => {
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
        let matches = this.mainquery.match(/FROM\s[a-z]*\s[a-z]*/gm).concat(this.mainquery.match(/JOIN\s*[a-z]*\s[a-z]*/gm));
        for (let match of matches) {
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
