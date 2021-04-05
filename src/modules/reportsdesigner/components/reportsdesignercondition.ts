/*
SpiceUI 2021.01.001

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
    /**
     * true if the operator contains oneof
     * @private
     */
    private isMultiSelect: boolean = false;

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
    private getOperators() {
        let retArray = [];
        const operatorType = this.reporterConfig.operatorAssignments[this.whereCondition.type] || 'varchar';
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
        if (!!whereConditions && whereConditions.some(condition => condition.type == this.whereCondition.type && !!condition.reference)) {
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
    private changeOperator() {
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
    protected trackByFn(index, item) {
        return index;
    }
}
