/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitempivot.html'
})
export class ReportsDesignerPresentItemPivot {

    constructor(public language: language, public model: model) {
    }
}
