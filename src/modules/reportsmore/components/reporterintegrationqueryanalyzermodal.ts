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
     * indicates that the data is not yet loaded
     */
    private loading: boolean = true;

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
        this.backend.postRequest('KReporter/plugins/action/kqueryanalizer/get_sql', {}, postBody).subscribe(sql => {
                this.mainquery = sql.main;
                this.formattedquery = sql.formatted;
                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }

    /**
     * a getter for the formatted query, domSanitized
     */
    get queryformatted() {
        return this.sanitizer.bypassSecurityTrustHtml(this.formattedquery);
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
}
