/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-condition-group-expansion',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerconditiongroupexpansion.html'
})
export class ReportsDesignerConditionGroupExpansion implements OnInit {

    /**
     * @input whereCondition: object
     */
    @Input() private whereCondition: any;

    private contextUsed: boolean = false;

    constructor(private language: language, private model: model) {
    }

    /**
     * @return jointype: boolean
     */
    get referenceDisabled() {
        const referenceUsed = this.model.getField('whereconditions').some(condition => condition.referencefieldid == this.whereCondition.fieldid);
        return this.whereCondition.operator == 'reference' || referenceUsed;
    }

    public ngOnInit() {
        this.setContextReferenceUse();
    }

    /**
     * set the contextUsed to true if any of visualizationParams plugins has used it
     */
    private setContextReferenceUse() {
        const visualizationParams = this.model.getField('visualization_params');
        if (!visualizationParams) return;
        for (let key in visualizationParams) {
            if (visualizationParams.hasOwnProperty(key)) {
                if (!!visualizationParams[key].googlecharts) {
                    if (!!visualizationParams[key].googlecharts.context && !!this.whereCondition.context &&
                        this.whereCondition.context == visualizationParams[key].googlecharts.context) {
                        this.contextUsed = true;
                    }
                }
                if (!!visualizationParams[key].highcharts) {
                    if (!!visualizationParams[key].highcharts.context && !!this.whereCondition.context &&
                        this.whereCondition.context == visualizationParams[key].highcharts.context) {
                        this.contextUsed = true;
                    }
                }
            }
        }
    }
}
