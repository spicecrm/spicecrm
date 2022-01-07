/**
 * @module ModuleReportsDesigner
 */
import {Component, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {ReportsDesignerVisualizeItemChartDataPanel} from "./reportsdesignervisualizeitemchartdatapanel";

@Component({
    selector: 'reports-designer-visualize-item-chart-data-panel-multiple-series',
    templateUrl: '../templates/reportsdesignervisualizeitemchartdatapanelmultipleseries.html'
})
export class ReportsDesignerVisualizeItemChartDataPanelMultipleSeries extends ReportsDesignerVisualizeItemChartDataPanel {

    constructor(public language: language,
                public model: model,
                public renderer: Renderer2,
                public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    get availableListFields() {
        return !this.properties.dataseries || this.properties.dataseries.length == 0 ? this.listFields :
            this.listFields.filter(field => !this.properties.dataseries
                .some(series => series.fieldid === field.fieldid)
            );
    }
}
