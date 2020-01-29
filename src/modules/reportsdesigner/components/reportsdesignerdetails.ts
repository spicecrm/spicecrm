/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-details',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerdetails.html'
})
export class ReportsDesignerDetails implements OnInit {

    constructor(private language: language, private model: model) {
    }

    public ngOnInit() {
        if (!this.model.getField('reportoptions')) this.model.setField('reportoptions', {});
    }

    /**
    * @return reportoptions: object[]
     */
    get reportOptions() {
        return this.model.getField('reportoptions');
    }
}
