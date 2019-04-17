/**
 * @module ModuleReports
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';

import {language} from '../../../services/language.service';

@Component({
    selector: 'reporter-integration-queryanalyzer-modal',
    templateUrl: './src/modules/reports/templates/reporterintegrationqueryanalyzermodal.html'
})
export class ReporterIntegrationQueryanalyzerModal implements OnInit {

    private self: any = {};
    private model: any = {};
    private whereConditions: any = {};

    private mainquery: string = '.. loading ..';

    constructor(private language: language, private metadata: metadata, private backend: backend) {
    }

    public ngOnInit() {
        let postBody = {
            record: this.model.id,
            whereOverride: JSON.stringify(this.whereConditions)
        }
        this.backend.postRequest('KReporter/plugins/action/kqueryanalizer/get_sql', {}, postBody).subscribe(sql => {
            this.mainquery = sql.main;
        });
    }

    private closeModal() {
        this.self.destroy();
    }
}
