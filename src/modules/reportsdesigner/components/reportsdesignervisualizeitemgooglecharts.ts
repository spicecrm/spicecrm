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

    protected dimensionsOptions: any[] = [
        {
            value: '111',
            name: `${this.language.getLabel('LBL_ONE_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`
        }, {
            value: '10N',
            name: `${this.language.getLabel('LBL_ONE_DIMENSIONAL')} (${this.language.getLabel('LBL_VALUES')})`

        }, {
            value: '221',
            name: `${this.language.getLabel('LBL_TWO_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`

        }, {
            value: '21N',
            name: `${this.language.getLabel('LBL_TWO_DIMENSIONAL')} (${this.language.getLabel('LBL_VALUES')})`

        }, {
            value: '220',
            name: `${this.language.getLabel('LBL_TWO_DIMENSIONAL')} (${this.language.getLabel('LBL_NO_VALUES')})`

        }, {
            value: '331',
            name: `${this.language.getLabel('LBL_THREE_DIMENSIONAL')} (${this.language.getLabel('LBL_SERIES')})`
        }];

    constructor(private language: language, private model: model, private reportsDesignerService: ReportsDesignerService) {

    }

    public ngOnInit() {
        this.initializeProperties();
    }

    /**
     * set the initial plugin properties data
     */
    private initializeProperties() {
        if (this.properties.googlecharts) return;
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
     * @return properties: object
     */
    get properties() {
        return this.model.getField('visualization_params')[this.reportsDesignerService.visualizeActiveLayoutItem];
    }

}
