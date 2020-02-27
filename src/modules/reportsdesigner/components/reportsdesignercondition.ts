/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, KeyValueDiffer, KeyValueDiffers} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {reporterconfig} from "../../../modules/reports/services/reporterconfig";

@Component({
    selector: 'reports-designer-condition',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignercondition.html',
})
export class ReportsDesignerCondition {

    /**
    * @input whereCondition: object
     */
    @Input() private whereCondition: any = {};

    constructor(private language: language,
                private model: model,
                private reporterConfig: reporterconfig) {

    }

    /**
    * @return type: string
     */
    get itemType() {
        let type = 'text';

        switch (this.whereCondition.type) {
            case 'enum':
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
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                switch (this.whereCondition.operator) {
                    case 'before':
                    case 'after':
                    case 'between':
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

        return type;

    }

    /**
    * @return showValue: boolean
     */
    get showValue() {
        return this.whereCondition.operator == 'reference' || this.reporterConfig.operatorCount[this.whereCondition.operator] > 0;
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
    private getOperators() {
        let retArray = [];
        let operators = this.reporterConfig.operatorTypes[this.reporterConfig.operatorAssignments[this.whereCondition.type]];
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
        if (whereConditions.some(condition => condition.type == this.whereCondition.type && !!condition.reference)) {
            retArray.push({
                value: 'reference',
                display: this.language.getLabel('LBL_REFERENCE')
            });
        }

        retArray.sort((a, b) => a.display > b.display ? 1 : -1);

        return retArray;
    }

    /**
    * @reset whereCondition
     */
    private changeOperator() {
        this.whereCondition.value = '';
        this.whereCondition.valuekey = '';
        this.whereCondition.valueto = '';
        this.whereCondition.valuetokey = '';
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFn(index, item) {
        return index;
    }
}
