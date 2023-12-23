/**
 * @module ModuleReports
 */
import {
    Component,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item',
    templateUrl: '../templates/reporterfilteritem.html'
})
export class ReporterFilterItem {

    @Input() public wherecondition: any = {};

    constructor(public language: language, public model: model, public reporterconfig: reporterconfig) {

    }

    public getOperators() {
        let retArray = [];
        const operatorType = this.reporterconfig.operatorAssignments[this.wherecondition.type] || 'varchar';
        let operators = this.reporterconfig.operatorTypes[operatorType];
        for (let oprator of operators) {
            retArray.push({
                value: oprator,
                display: this.language.getLabel('LBL_OP_' + oprator.toUpperCase())
            });
        }

        retArray.sort((a, b) => a.display > b.display ? 1 : -1);

        return retArray;
    }

    get itemType() {
        let type = 'text';

        switch (this.wherecondition.type) {
            case 'enum':
            case 'multienum':
            case 'radioenum':
                switch (this.wherecondition.operator) {
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
                switch (this.wherecondition.operator) {
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
                switch (this.wherecondition.operator) {
                    case 'before':
                    case 'after':
                    case 'between':
                    case 'equals':
                        type = 'date';
                        break;
                }
                break;
        }

        return type;

    }

    get showValue() {
        return this.reporterconfig.operatorCount[this.wherecondition.operator] > 0;
    }

    get showValueTo() {
        return this.reporterconfig.operatorCount[this.wherecondition.operator] > 1;
    }

    public changeOperator() {
        this.wherecondition.value = '';
        this.wherecondition.valuekey = '';
        this.wherecondition.valueto = '';
        this.wherecondition.valuetokey = '';
    }

}
