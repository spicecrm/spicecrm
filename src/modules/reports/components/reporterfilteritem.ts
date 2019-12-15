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
    templateUrl: './src/modules/reports/templates/reporterfilteritem.html'
})
export class ReporterFilterItem {

    @Input() private wherecondition: any = {};

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

    private getOperators() {
        let retArray = [];
        let operators = this.reporterconfig.operatorTypes[this.reporterconfig.operatorAssignments[this.wherecondition.type]];
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
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                switch (this.wherecondition.operator) {
                    case 'before':
                    case 'after':
                    case 'between':
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

    private changeOperator() {
        this.wherecondition.value = '';
        this.wherecondition.valuekey = '';
        this.wherecondition.valueto = '';
        this.wherecondition.valuetokey = '';
    }

}