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
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualize.html'
})
export class ReportsDesignerVisualize {

    protected plugins: any[] = [];
    private _selectedItemId: string = '';
    private _selectedLayout: any;
    protected radioButtonItems: string[] = ['1','2','3','4','5'];
    private activeLayoutItem: string;

    protected layoutOptions: any = [
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

    constructor(private language: language, private metadata: metadata, private reportsDesignerService: ReportsDesignerService, private model: model) {
    }

    /**
     * set the layout and define its items
     * @param chartHeight: number
     */
    set chartHeight(chartHeight) {
        this.model.getField('visualization_params').chartheight = chartHeight;
    }

    /**
     * @return chartHeight: number
     */
    get chartHeight() {
        return this.model.getField('visualization_params').chartheight;
    }

    /**
     * set the layout and define its items
     * @param layout: object
     */
    set selectedLayout(layout) {
        this.model.getField('visualization_params').layout = layout.value;
        this._selectedLayout = layout;
        if (!this._selectedLayout) this.activeLayoutItem = undefined;
    }

    /**
     * @return selectedLayout: string
     */
    get selectedLayout() {
        return this._selectedLayout;
    }

    /**
     * @return selectedItemId: string
     */
    get selectedItemId() {
        return this._selectedItemId;
    }

    /**
     * set selected item id and initialize the visualization params
     * @param value: string
     */
    set selectedItemId(value) {
        this._selectedItemId = value;

    }

    /**
     * initialize the visualization params and call loadPlugins
     */
    public ngOnInit() {
        this.initializeVisualizationParams();
        this.plugins = this.reportsDesignerService.loadPlugins('ReportsDesignerVisualize');
    }

    /**
     * set the initial visualization params data
     */
    private initializeVisualizationParams() {
        let visualizationParams = this.model.getField('visualization_params');
        if (!visualizationParams) {
            visualizationParams = {};
        }
        if (!visualizationParams.layout) {
            visualizationParams.layout = '-';
        }
        this._selectedLayout = this.layoutOptions.find(option => option.value == visualizationParams.layout);
        this.activeLayoutItem = '1';
        this.model.setField('visualization_params', visualizationParams);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return item.id;
    }
}
