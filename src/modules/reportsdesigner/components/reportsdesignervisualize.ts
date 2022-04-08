/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-visualize',
    templateUrl: '../templates/reportsdesignervisualize.html'
})
export class ReportsDesignerVisualize {

    public plugins: any[] = [];
    public radioButtonItems: string[] = ['1', '2', '3', '4', '5'];
    public layoutOptions: any = [
        {value: '-', itemsCount: 0},
        {value: '1x1', itemsCount: 1},
        {value: '1x2', itemsCount: 2},
        {value: '1x3', itemsCount: 3},
        {value: '1x4', itemsCount: 4},
        {value: '2x2', itemsCount: 4},
        {value: '2x2wide', itemsCount: 4},
        {value: '1x3x2', itemsCount: 3},
        {value: '1x2x1', itemsCount: 2},
        {value: '1+1+2', itemsCount: 4},
        {value: '1x2x2', itemsCount: 3},
        {value: '2x1x4', itemsCount: 5},
    ];

    constructor(public language: language,
                public metadata: metadata,
                public reportsDesignerService: ReportsDesignerService,
                public model: model) {
    }

    public _selectedLayout: any;

    /**
     * @return selectedLayout: string
     */
    get selectedLayout() {
        return this._selectedLayout;
    }

    /**
     * set the layout and define its items
     * @param layout: object
     */
    set selectedLayout(layout) {
        this.model.getField('visualization_params').layout = layout.value;
        this._selectedLayout = layout;
        this.activeLayoutItem = this._selectedLayout.itemsCount > 0 ? '1' : undefined;
    }

    /**
     * @return integrationParams: object
     */
    get visualizationParams() {
        let vizParams = this.model.getField('visualization_params');
        return  vizParams ? vizParams : {};
    }

    /**
     * @return item: string
     */
    get activeLayoutItem() {
        return this.reportsDesignerService.visualizeActiveLayoutItem;
    }

    /**
     * set the active layout item and initialize it if it is not defined yet
     * @param item: string
     */
    set activeLayoutItem(item) {
        this.reportsDesignerService.visualizeActiveLayoutItem = item;
        if (!this.visualizationParams[item]) this.visualizationParams[item] = {};
    }

    /**
     * @return selectedItemId: string
     */
    get selectedPluginId() {
        return this.visualizationParams[this.activeLayoutItem]?.plugin;
    }

    /**
     * set selected item id and initialize the visualization params
     * @param value: string
     */
    set selectedPluginId(value) {
        this.visualizationParams[this.activeLayoutItem].plugin = value;
    }

    /**
     * @return chartHeight: number
     */
    get chartHeight() {
        return this.model.getField('visualization_params').chartheight;
    }

    /**
     * set the layout and define its items
     * @param chartHeight: number
     */
    set chartHeight(chartHeight) {
        this.model.getField('visualization_params').chartheight = chartHeight;
    }

    /**
     * initialize the visualization params and call loadPlugins
     * call loadVisualizationColors from service
     */
    public ngOnInit() {
        this.initializeVisualizationParams();
        this.reportsDesignerService.loadVisualizationColors();
        this.plugins = this.reportsDesignerService.loadPlugins('ReportsDesignerVisualize');
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * set the initial visualization params data
     */
    public initializeVisualizationParams() {
        let visualizationParams = this.model.getField('visualization_params');
        if (!visualizationParams) {
            visualizationParams = {};
        }
        if (!visualizationParams.layout) {
            visualizationParams.layout = '-';
        }
        if (!visualizationParams.chartheight) {
            visualizationParams.chartheight = 400;
        }
        this._selectedLayout = this.layoutOptions.find(option => option.value == visualizationParams.layout);
        this.activeLayoutItem = '1';
        this.model.setField('visualization_params', visualizationParams);
    }
}
