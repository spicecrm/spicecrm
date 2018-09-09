import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'reporter-integration-queryanalyzer-modal',
    templateUrl: './app/modules/reports/templates/reporterintegrationqueryanalyzermodal.html'
})
export class ReporterIntegrationQueryanalyzerModal implements OnInit{

    self: any = {};
    model: any = {};
    whereConditions: any = {};

    mainquery: string = '.. loading ..';



    constructor(private language: language, private metadata: metadata, private backend: backend) {
    }

    ngOnInit(){
        let postBody = {
            record: this.model.id,
            whereOverride: JSON.stringify(this.whereConditions)
        }
        this.backend.postRequest('KReporter/plugins/action/kqueryanalizer/get_sql', {}, postBody).subscribe(sql => {
            this.mainquery = sql.main;
        })
    }

    closeModal() {
        this.self.destroy();
    }



}