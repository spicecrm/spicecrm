/**
 * @module ModuleReportsDesigner
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-visualize-item-chart-type-panel',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemcharttypepanel.html'
})
export class ReportsDesignerVisualizeItemChartTypePanel {
    LBL_CHART_TYPE
    LBL_LAYOUT
    LBL_ITEMS
    protected typeOptions = [{
        dimensions: ['111', '10N', '221', '21N'],
        value: 'Area',
        name: this.language.getLabel('LBL_AREA_CHART')
    }, {
        dimensions: ['111', '10N', '221', '21N'],
        value: 'SteppedArea',
        name: this.language.getLabel('LBL_STEPPED_AREA_CHART')
    }, {
        dimensions: ['221','331'],
        value: 'Bubble',
        name: this.language.getLabel('LBL_BUBBLE_CHART')
    }, {
        dimensions: ['221'],
        value: 'Sankey',
        name: this.language.getLabel('LBL_SANKEY_CHART')
    }, {
        dimensions: ['111', '10N', '221', '21N'],
        value: 'Bar',
        name: this.language.getLabel('LBL_BAR_CHART')
    }, {
        dimensions: ['111', '10N', '221', '21N'],
        value: 'Column',
        name: this.language.getLabel('LBL_COLUMN_CHART')
    }, {
        dimensions: ['111', '10N', '221', '21N'],
        value: 'Line',
        name: this.language.getLabel('LBL_LINE_CHART')
    }, {
        dimensions: ['220'],
        value: 'Scatter',
        name: this.language.getLabel('LBL_SCATTER_CHART')
    }, {
        dimensions: ['111', '10N'],
        value: 'Pie',
        name: this.language.getLabel('LBL_PIE_CHART')
    }, {
        dimensions: ['111', '10N'],
        value: 'Donut',
        name: this.language.getLabel('LBL_DONUT_CHART')
    }, {
        dimensions: ['10N', '21N'],
        value: 'Combo',
        name: this.language.getLabel('LBL_COMBO_CHART')
    }];
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
     * @return colors: object[]
     */
    get themeColors() {
        const theme = this.reportsDesignerService.visualizeColorTheme.find(color => color.id == this.properties.colors);
        return !!theme ? theme.colors : [];
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
