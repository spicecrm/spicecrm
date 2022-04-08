/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-condition-group-expansion',
    templateUrl: '../templates/reportsdesignerconditiongroupexpansion.html'
})
export class ReportsDesignerConditionGroupExpansion implements OnInit {

    /**
     * @input whereCondition: object
     */
    @Input() public whereCondition: any;

    public contextUsed: boolean = false;

    constructor(public language: language,
                public reportsDesignerService: ReportsDesignerService,
                public model: model) {
    }

    /**
     * disable the required checkbox if we are on a root elemet
     */
    get requiredEnabled() {
        return this.whereCondition.path.split('::').length > 2;
    }

    /**
     * @param value boolean
     * @set jointype = 'required' | 'optional'
     */
    set joinType(value) {
        this.whereCondition.jointype = value ? 'required' : 'optional';
    }

    /**
     * @return jointype: boolean
     */
    get joinType() {
        return this.whereCondition.jointype == 'required';
    }

    /**
     * @return jointype: boolean
     */
    get referenceDisabled() {
        const referenceUsed = this.model.getField('whereconditions')
            .some(condition => this.whereCondition.fieldid != condition.fieldid && condition.operator == 'reference' && condition.value == this.whereCondition.reference);
        return this.whereCondition.operator == 'reference' || referenceUsed;
    }

    public ngOnInit() {
        this.setContextReferenceUse();
    }

    /**
     * set the contextUsed to true if any of visualizationParams plugins has used it
     */
    public setContextReferenceUse() {
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
