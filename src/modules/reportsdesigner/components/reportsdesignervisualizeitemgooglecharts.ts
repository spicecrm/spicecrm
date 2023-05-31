/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-visualize-item-google-charts',
    templateUrl: '../templates/reportsdesignervisualizeitemgooglecharts.html'
})
export class ReportsDesignerVisualizeItemGoogleCharts implements OnInit {

    public contextOptions: any[] = [];
    public typeOptions: any[] = [];
    public dimensionsOptions: any[] = [];

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {

    }

    /**
     * @return properties: object
     */
    get properties() {
        return this.model.getField('visualization_params')[this.reportsDesignerService.visualizeActiveLayoutItem];
    }

    public ngOnInit() {
        this.initializeVisualizationOptions();
        this.initializeProperties();
    }

    /**
     * set option lists for visulization item
     */
    public initializeVisualizationOptions(){
        this.dimensionsOptions = [
            {
                value: '111',
                name: `1 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`
            }, {
                value: '10N',
                name: `1 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_VALUES')})`

            }, {
                value: '221',
                name: `2 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`

            }, {
                value: '21N',
                name: `2 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_VALUES')})`

            }, {
                value: '220',
                name: `2 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_NO_VALUES')})`

            }, {
                value: '331',
                name: `3 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`
            }];

        this.typeOptions = [{
            dimensions: ['111', '10N', '221', '21N'],
            value: 'Area',
            name: this.language.getLabel('LBL_AREA_CHART')
        }, {
            dimensions: ['111', '10N', '221', '21N'],
            value: 'SteppedArea',
            name: this.language.getLabel('LBL_STEPPED_AREA_CHART')
        }, {
            dimensions: ['221', '331'],
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
    }
        /**
     * set the initial plugin properties data and load the context options
     */
    public initializeProperties() {
        this.contextOptions = this.model.getField('whereconditions')
            .filter(condition => !!condition.context)
            .map(condition => condition.context);

        if (this.properties.googlecharts && this.properties.googlecharts.uid) return;
        this.properties.googlecharts = {
            uid: this.reportsDesignerService.generateGuid(),
            title: '',
            dims: '111',
            type: 'Area',
            colors: 'default',
            dataseries: [],
            options: {},
            context: '',
            legend: null,
            dimensions: {
                dimension1: null,
                dimension2: null,
                dimension3: null
            }
        };
    }

    /**
     * set the properties option
     * @param name: string
     * @param bool: boolean
     */
    public setPropertiesOption(name, bool) {
        this.properties.googlecharts.options[name] = bool ? 'on' : 'off';
    }
}
