/**
 * @module ModuleReportsDesignerMore
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "../../../modules/reportsdesigner/components/reportsdesignerpresentitemstandard";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-present-item-standard-with-summary',
    templateUrl: '../../reportsdesigner/templates/reportsdesignermorepresentitemstandardwithsummary.html'
})
export class ReportsDesignerMorePresentItemStandardWithSummary extends ReportsDesignerPresentItemStandard {

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }
}
