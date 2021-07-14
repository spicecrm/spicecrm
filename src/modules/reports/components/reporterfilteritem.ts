/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
