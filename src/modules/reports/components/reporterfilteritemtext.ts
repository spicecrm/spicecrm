/**
 * @module ModuleReports
 */
import {
    Component,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-text',
    templateUrl: './src/modules/reports/templates/reporterfilteritemtext.html'
})
export class ReporterFilterItemText {

    @Input() private field : string = '';
    @Input() private wherecondition : any = {};

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

}