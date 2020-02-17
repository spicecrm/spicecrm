/**
 * @module ModuleReportsDesigner
 */
import {Component, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {ReportsDesignerVisualizeItemChartDataPanel} from "./reportsdesignervisualizeitemchartdatapanel";
import {CdkDragExit} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-visualize-item-chart-data-panel-multiple-series',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemchartdatapanelmultipleseries.html'
})
export class ReportsDesignerVisualizeItemChartDataPanelMultipleSeries extends ReportsDesignerVisualizeItemChartDataPanel {

    constructor(public language: language,
                public model: model,
                public renderer: Renderer2,
                public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    /**
     * append a placeholder to the dom keep space reserved for the dragged element in its origin
     * @param e: CdkDragExit
     */
    private dropExited(e: CdkDragExit) {
        this.reportsDesignerService.dragPlaceHolderNode = e.item.getRootElement().cloneNode(true);
        this.renderer.setStyle(this.reportsDesignerService.dragPlaceHolderNode, 'display', 'table-row');
        let index = e.container.data.findIndex(item => item.id == e.item.data.id);
        if (index > -1) {
            e.container.element.nativeElement.insertBefore(
                this.reportsDesignerService.dragPlaceHolderNode,
                e.container.element.nativeElement.children[index]
            );
        }
    }

    /**
     * remove PlaceHolder Element
     * @param e: CdkDragEnter
     */
    private dropEnteredDragList(e) {
        this.reportsDesignerService.removePlaceHolderElement(e.container.element.nativeElement);
    }
}
