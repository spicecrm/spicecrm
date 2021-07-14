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
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-visualize-item-google-charts',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemgooglecharts.html'
})
export class ReportsDesignerVisualizeItemGoogleCharts implements OnInit {

    protected contextOptions: any[] = [];

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

        }, {
            value: '220',
            name: `2 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_NO_VALUES')})`

        }, {
            value: '331',
            name: `3 ${this.language.getLabel('LBL_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`
        }];

    protected typeOptions = [{
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
     * set the initial plugin properties data and load the context options
     */
    private initializeProperties() {
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
    private setPropertiesOption(name, bool) {
        this.properties.googlecharts.options[name] = bool ? 'on' : 'off';
    }
}
