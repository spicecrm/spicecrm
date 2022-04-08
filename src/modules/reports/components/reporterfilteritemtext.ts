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
    templateUrl: '../templates/reporterfilteritemtext.html'
})
export class ReporterFilterItemText {

    @Input() public field : string = '';
    @Input() public wherecondition : any = {};

    constructor(public language: language, public model: model, public reporterconfig: reporterconfig) {

    }

}
