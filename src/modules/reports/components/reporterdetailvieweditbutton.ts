/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reporter-detail-view-edit-button',
    templateUrl: './src/modules/reports/templates/reporterdetailvieweditbutton.html'
})
export class ReporterDetailViewEditButton {

    constructor(public language: language, private router: Router, private model: model) {
    }

    /**
     * navigate to reports designer
     */
    private execute() {
        this.router.navigate(['/module/KReports/designer/' + this.model.id]);
    }
}
