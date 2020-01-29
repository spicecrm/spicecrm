/**
 * @module ModuleReportsDesigner
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

declare var _;

@Component({
    selector: 'reports-designer-condition-group-expansion',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerconditiongroupexpansion.html'
})
export class ReportsDesignerConditionGroupExpansion {

    /**
    * @input whereCondition: object
     */
    @Input() private whereCondition: any;

    constructor(private language: language) {
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

    /**
    * @set jointype = 'yes' | 'no'
     */
    set dashletEditable(value) {
        this.whereCondition.dashleteditable = value ? 'yes' : 'no';
    }

    /**
    * @return jointype: boolean
     */
    get dashletEditable() {
        return this.whereCondition.dashleteditable == 'yes';
    }
}
