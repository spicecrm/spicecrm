/**
 * @module ModuleReportsDesigner
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-visualize-item-chart-type-panel',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemcharttypepanel.html'
})
export class ReportsDesignerVisualizeItemChartTypePanel {

    /**
     * @input dimensionsOptions: object[]
     */
    @Input() protected typeOptions: any[] = [];
    /**
     * @input dimensionsOptions: object[]
     */
    @Input() private dimensionsOptions: any[] = [];
    /**
     * @input properties: object
     */
    @Input() private properties: any = {};

    constructor(private language: language, private reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return typeOptionsFiltered: object[]
     */
    get typeOptionsFiltered() {
        return this.typeOptions.filter(typeOption => typeOption.dimensions.indexOf(this.properties.dims) > -1);
    }

    /**
     * @return colors: object[]
     */
    get themeColors() {
        const theme = this.reportsDesignerService.visualizeColorTheme.find(color => color.id == this.properties.colors);
        return !!theme ? theme.colors : [];
    }

    /**
     * @return colors: object[]
     */
    get colorOptions() {
        return this.reportsDesignerService.visualizeColorTheme;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFnValue(index, item) {
        return item.value;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFnIndex(index, item) {
        return index;
    }
}
