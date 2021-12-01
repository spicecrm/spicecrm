/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {ReportsDesignerVisualizeItemChartDataPanel} from "./reportsdesignervisualizeitemchartdatapanel";

@Component({
    selector: 'reports-designer-visualize-item-chart-data-panel-single-series',
    templateUrl: '../templates/reportsdesignervisualizeitemchartdatapanelsingleseries.html'
})
export class ReportsDesignerVisualizeItemChartDataPanelSingleSeries extends ReportsDesignerVisualizeItemChartDataPanel {

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }
}
