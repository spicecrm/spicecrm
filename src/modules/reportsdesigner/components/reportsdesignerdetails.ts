/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-details',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerdetails.html'
})
export class ReportsDesignerDetails {

    constructor(private language: language, private model: model) {
    }

    set reportOptions(value) {
        this.model.setField('reportoptions', JSON.stringify(value));
    }

    get reportOptions() {
        let options = this.model.getField('reportoptions');
        return options && options.length > 0 ? JSON.parse(options) : {};
    }

    private setModelReportOptions(field, value) {
        let reportOptions = this.reportOptions;
        reportOptions[field] = value;
        this.reportOptions = reportOptions;
    }
}
