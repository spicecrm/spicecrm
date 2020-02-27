/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-visualize-item-high-charts',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemhighcharts.html'
})
export class ReportsDesignerVisualizeItemHighCharts implements OnInit {

    protected contextOptions: any[] = [];

    protected typeOptions = [
        {
            dimensions: ['111','10N','221','21N'],
            value: 'area',
            name: this.language.getLabel('LBL_AREA_CHART')
        }, {
            dimensions: ['111','10N','221','21N'],
            value: 'areaspline',
            name: this.language.getLabel('LBL_AREA_SPLINE_CHART')
        }, {
            dimensions: ['111','10N'],
            value: 'area_trend',
            name: this.language.getLabel('LBL_AREA_WITH_TREND_LINE')
        }, {
            dimensions: ['111','10N'],
            value: 'areaspline_trend',
            name: this.language.getLabel('LBL_AREA_SPLINE_WITH_TREND_LINE')
        }, {
            dimensions: ['221','21N','111','10N'],
            value: 'column',
            name: this.language.getLabel('LBL_COLUMN_CHART')
        }, {
            dimensions: ['221','21N'],
            value: 'column_stacked',
            name: this.language.getLabel('LBL_COLUMNS_STACKED')
        }, {
            dimensions: ['221','21N'],
            value: 'column_stckpol',
            name: this.language.getLabel('LBL_COLUMNS_STACKED_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'column_stckppl',
            name: this.language.getLabel('LBL_COLUMNS_STACKED_POLAR') + ' 100%'
        }, {
            dimensions: ['221','21N','111','10N'],
            value: 'column_stckper',
            name: this.language.getLabel('LBL_COLUMNS_STACKED') + ' 100%'
        }, {
            dimensions: ['221','21N'],
            value: 'line',
            name: this.language.getLabel('LBL_LINE_CHART')
        }, {
            dimensions: ['221','21N', '111','10N'],
            value: 'line_polr',
            name: this.language.getLabel('LBL_LINE_POLAR')
        }, {
            dimensions: ['221','21N','111','10N'],
            value: 'spline',
            name: this.language.getLabel('LBL_SPLINE_CHART')
        }, {
            dimensions: ['221','21N','111','10N'],
            value: 'spline_polr',
            name: this.language.getLabel('LBL_SPLINE_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'area_polr',
            name: this.language.getLabel('LBL_AREA_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'area_stacked',
            name: this.language.getLabel('LBL_AREA_STACKED')
        }, {
            dimensions: ['221','21N'],
            value: 'area_stckpol',
            name: this.language.getLabel('LBL_AREA_STACKED_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'area_stckppl',
            name: this.language.getLabel('LBL_AREA_STACKED_POLAR') + ' 100%'
        }, {
            dimensions: ['221','21N'],
            value: 'area_stckper',
            name: this.language.getLabel('LBL_AREA_STACKED') + ' 100%'
        }, {
            dimensions: ['221','21N'],
            value: 'areaspline_polr',
            name: this.language.getLabel('LBL_AREA_SPLINE_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'areaspline_stacked',
            name: this.language.getLabel('LBL_AREA_SPLINE_STACKED')
        }, {
            dimensions: ['221','21N'],
            value: 'areaspline_stckpol',
            name: this.language.getLabel('LBL_AREA_SPLINE_STACKED_POLAR')
        }, {
            dimensions: ['221','21N'],
            value: 'areaspline_stckppl',
            name: this.language.getLabel('LBL_AREA_SPLINE_STACKED_POLAR') + ' 100%'
        }, {
            dimensions: ['221','21N'],
            value: 'areaspline_stckper',
            name: this.language.getLabel('LBL_AREA_SPLINE_STACKED') + ' 100%'
        }, {
            dimensions: ['221','21N', '111','10N'],
            value: 'bar',
            name: this.language.getLabel('LBL_BAR_CHART')
        }, {
            dimensions: ['221','21N'],
            value: 'bar_stacked',
            name: this.language.getLabel('LBL_BAR_STACKED')
        }, {
            dimensions: ['221','21N'],
            value: 'bar_stckper',
            name: this.language.getLabel('LBL_BAR_STACKED') + ' 100%'
        }, {
            dimensions: ['111','10N'],
            value: 'column_trend',
            name: this.language.getLabel('LBL_COLUMN_WITH_TREND_LINE')
        }, {
            dimensions: ['111','10N'],
            value: 'column_polr',
            name: this.language.getLabel('LBL_COLUMN_POLAR')
        }, {
            dimensions: ['111','10N'],
            value: 'pie',
            name: this.language.getLabel('LBL_PIE_CHART')
        }, {
            dimensions: ['111','10N'],
            value: 'pie_donut',
            name: this.language.getLabel('LBL_DONUT_CHART')
        }, {
            dimensions: ['111','10N'],
            value: 'pie_180',
            name: this.language.getLabel('LBL_PIE_CHART') + ' 180°'
        }, {
            dimensions: ['111','10N'],
            value: 'pie_donut180',
            name: this.language.getLabel('LBL_DONUT_CHART') + ' 180°'
        }, {
            dimensions: ['111','10N'],
            value: 'funnel',
            name: this.language.getLabel('LBL_FUNNEL_CHART')
        }, {
            dimensions: ['111','10N'],
            value: 'pyramid',
            name: this.language.getLabel('LBL_PYRAMID_CHART')
        }
    ];

    protected dimensionsOptions: any[] = [
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
        }
    ];

    constructor(private language: language, private model: model, private reportsDesignerService: ReportsDesignerService) {

    }

    /**
     * @return properties: object
     */
    get properties() {
        return this.model.getField('visualization_params')[this.reportsDesignerService.visualizeActiveLayoutItem];
    }

    public ngOnInit() {
        this.initializeProperties();
    }

    /**
     * set the initial plugin properties data
     */
    private initializeProperties() {
        this.contextOptions = this.model.getField('whereconditions')
            .filter(condition => !!condition.context)
            .map(condition => condition.context);

        if (this.properties.highcharts && this.properties.highcharts.uid) return;
        this.properties.highcharts = {
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
    private setPropertiesOption(name, bool) {
        this.properties.highcharts.options[name] = bool ? 'on' : 'off';
    }
}
