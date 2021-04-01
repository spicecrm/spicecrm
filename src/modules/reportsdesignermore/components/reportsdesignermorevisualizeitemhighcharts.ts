/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleReportsDesignerMore
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-visualize-item-high-charts',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermorevisualizeitemhighcharts.html'
})
export class ReportsDesignerMoreVisualizeItemHighCharts implements OnInit {

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
