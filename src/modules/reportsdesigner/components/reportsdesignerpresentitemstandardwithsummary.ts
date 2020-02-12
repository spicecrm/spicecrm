/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerPresentItemStandard} from "./reportsdesignerpresentitemstandard";

@Component({
    selector: 'reports-designer-present-item-standard-with-summary',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemstandard.html'
})
export class ReportsDesignerPresentItemStandardWithSummary extends ReportsDesignerPresentItemStandard {

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }
}
