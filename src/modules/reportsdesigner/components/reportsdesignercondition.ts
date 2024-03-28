/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, KeyValueDiffer, KeyValueDiffers} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {reporterconfig} from "../../../modules/reports/services/reporterconfig";

@Component({
    selector: 'reports-designer-condition',
    templateUrl: '../templates/reportsdesignercondition.html',
})
export class ReportsDesignerCondition {

    /**
    * @input whereCondition: object
     */
    @Input() public whereCondition: any = {};
    /**
     * true if the operator contains oneof
     * @private
     */
    public isMultiSelect: boolean = false;

    constructor(public language: language,
                public model: model,
                public reporterConfig: reporterconfig) {

    }

    /**
    * @return type: string
     */
    get itemType() {
        let type = 'text';

        switch (this.whereCondition.type) {
            case 'enum':
            case 'multienum':
            case 'radioenum':
                switch (this.whereCondition.operator) {
                    case 'equals':
                    case 'notequal':
                    case 'oneof':
                    case 'oneofnot':
                    case 'oneofnotornull':
                        type = 'enum';
                        break;
                }
                break;
            case 'category':
                switch (this.whereCondition.operator) {
                    case 'equals':
                    case 'notequal':
                    case 'oneof':
                    case 'oneofnot':
                    case 'oneofnotornull':
                        type = 'category';
                        break;
                }
                break;
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                switch (this.whereCondition.operator) {
                    case 'before':
                    case 'after':
                    case 'between':
                    case 'equals':
                    case 'notequal':
                        type = 'date';
                        break;
                }
                break;
            default:
                switch (this.whereCondition.operator) {
                    case 'equals':
                    case 'notequal':
                    case 'oneof':
                    case 'oneofnot':
                    case 'oneofnotornull':
                        if (this.whereCondition.type.indexOf('user_id') > -1 || this.whereCondition.type.indexOf('user_name') > -1 ) {
                            type = 'user';
                        }
                        break;
                }
        }

        if (this.whereCondition.operator == 'reference') type = 'reference';
        if (this.whereCondition.operator == 'function') type = 'function';
        if (this.whereCondition.operator == 'parent_assign') type = 'parent_assign';

        return type;

    }

    /**
    * @return showValue: boolean
     */
    get showValue() {
        return this.whereCondition.operator == 'parent_assign' || this.whereCondition.operator == 'reference' || this.whereCondition.operator == 'function' || this.reporterConfig.operatorCount[this.whereCondition.operator] > 0;
    }

    /**
    * @return showValueTo: boolean
     */
    get showValueTo() {
        return this.reporterConfig.operatorCount[this.whereCondition.operator] > 1;
    }

    /**
    * @return operators: object[]
     */
    public getOperators() {
        let retArray = [];
        const operatorType = this.reporterConfig.operatorAssignments[this.whereCondition.overrideType || this.whereCondition.type] || 'varchar';
        let operators = this.reporterConfig.operatorTypes[operatorType];
        for (let oprator of operators) {
            retArray.push({
                value: oprator,
                display: this.language.getLabel('LBL_OP_' + oprator.toUpperCase())
            });
        }

        // push parent_assign operator if the publish as related in module is set
        const integrationParams = this.model.getField('integration_params');
        if (!!integrationParams && integrationParams.kpublishing && !!integrationParams.kpublishing.subpanelModule) {
            retArray.push({
                value: 'parent_assign',
                display: this.language.getLabel('LBL_ASSIGN_FROM_PARENT')
            });
        }

        // push reference operator if other condition has reference value
        const whereConditions = this.model.getField('whereconditions');
        if (!!whereConditions && whereConditions.some(condition => (this.reporterConfig.operatorAssignments[condition.type] || 'varchar' == operatorType) && !!condition.reference)) {
            retArray.push({
                value: 'reference',
                display: this.language.getLabel('LBL_REFERENCE')
            });
        }

        // push function operator  the are where functions found
        if (!!this.reporterConfig.whereFunctions && this.reporterConfig.whereFunctions.length > 0) {
            retArray.push({
                value: 'function',
                display: this.language.getLabel('LBL_FUNCTION')
            });
        }

        retArray.sort((a, b) => a.display > b.display ? 1 : -1);

        return retArray;
    }

    /**
    * @reset whereCondition
     */
    public changeOperator() {
        this.whereCondition.value = '';
        this.whereCondition.valuekey = '';
        this.whereCondition.valueto = '';
        this.whereCondition.valuetokey = '';
        this.whereCondition.referencefieldid = '';
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return index;
    }
}
