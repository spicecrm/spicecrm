/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-visualize-item-chart-data-panel',
    templateUrl: '../templates/reportsdesignervisualizeitemchartdatapanel.html'
})
export class ReportsDesignerVisualizeItemChartDataPanel implements OnChanges {

    /**
     * @input properties: object
     */
    @Input() public properties: any = {};

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return listFields: object[]
     */
    get listFields() {
        return this.model.getField('listfields');
    }

    public ngOnChanges() {
        this.initializeDataSeries();
    }

    /**
     * remove the placeholder element and push dropped item to dataseries array
     * @param event: CdkDragDrop
     */
    public onDrop(event: CdkDragDrop<any>) {

        this.properties.dataseries.push({
            id: this.reportsDesignerService.generateGuid(),
            fieldid: event.item.data.fieldid,
            name: event.item.data.name,
            chartfunction: '-',
            meaning: 'value',
            axis: '',
            renderer: '',
            color: ''
        });
    }

    /**
     * delete item from dataseries array
     * @param fieldId
     */
    public deleteSeries(fieldId) {
        this.properties.dataseries = this.properties.dataseries.filter(item => item.fieldid != fieldId);
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.fieldid;
    }

    /**
     * initialize the plugin dataseries
     */
    public initializeDataSeries() {
        if (this.properties.dataseries && this.properties.dataseries.length > 0) return;

        // check if single series or multiple
        if (this.properties.dims[2] == '1') {
            this.properties.dataseries = [{
                fieldid: '',
                name: '',
                chartfunction: '-',
                meaning: 'value',
                axis: 'P',
                renderer: ''
            }];
        } else {
            this.properties.dataseries = [];
        }
    }
}
