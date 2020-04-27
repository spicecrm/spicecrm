/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {reporterconfig} from "../services/reporterconfig";

@Component({
    selector: 'reporter-filter-item-function',
    templateUrl: './src/modules/reports/templates/reporterfilteritemfunction.html'
})
export class ReporterFilterItemFunction {
    /**
     * whereCondition: object
     */
    @Input() private whereCondition: any = {};

    constructor(private language: language, private reporterconfig: reporterconfig) {
    }

    set functionField(value: string) {
        this.whereCondition.value = value;
        this.whereCondition.valuekey = value;
    }

    get functionField(): string {
        return this.whereCondition.value;
    }
}
