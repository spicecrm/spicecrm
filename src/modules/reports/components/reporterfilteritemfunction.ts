/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {reporterconfig} from "../services/reporterconfig";

@Component({
    selector: 'reporter-filter-item-function',
    templateUrl: '../templates/reporterfilteritemfunction.html'
})
export class ReporterFilterItemFunction {
    /**
     * whereCondition: object
     */
    @Input() public whereCondition: any = {};

    constructor(public language: language, public reporterconfig: reporterconfig) {
    }

    set functionField(value: string) {
        this.whereCondition.value = value;
        this.whereCondition.valuekey = value;
    }

    get functionField(): string {
        return this.whereCondition.value;
    }
}
