/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";

declare var _;

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

    public ngOnInit() {
        this.setContextUsed();
    }

    /**
     * set the contextUsed to true if any of visualizationParams plugins has used it
     */
    private setContextUsed() {
        const visualizationParams = this.model.getField('visualization_params');
        if (!visualizationParams) return;
        for (let key in visualizationParams) {
            if (visualizationParams.hasOwnProperty(key)) {
                if (!!visualizationParams[key].googlecharts && !!visualizationParams[key].googlecharts.context &&
                    !!this.whereCondition.context && this.whereCondition.context == visualizationParams[key].googlecharts.context) {
                    this.contextUsed = true;
                    break;
                }
            }
        }
    }

    /**
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
}
