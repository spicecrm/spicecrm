/**
 * @module ModuleReports
 */
import {
    Component,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-date',
    templateUrl: './src/modules/reports/templates/reporterfilteritemdate.html'
})
export class ReporterFilterItemDate {

    @Input() private field: string = '';
    @Input() private wherecondition: any = {};

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

}