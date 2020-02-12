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

    constructor(private language: language, private metadata: metadata, private reportsDesignerService: ReportsDesignerService, private model: model) {
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
        if (!visualizationParams || !visualizationParams.layout) {
            visualizationParams.layout = '1x1';
        }
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
