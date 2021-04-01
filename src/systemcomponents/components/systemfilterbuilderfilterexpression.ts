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
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-filter-builder-expression',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpression.html',
})
export class SystemFilterBuilderFilterExpression implements OnInit {

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the durrect set filter expression
     */
    @Input() private filterexpression: any = {};

    /**
     * the selected operator type .. this is determined by the field definitions
     */
    public operatortype = 'default';

    @Output() private expressionDeleted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the operators available also grouped by type
     */
    public operators = {
        default: [
            {
                operator: 'equals',
                name: 'LBL_OP_EQUALS',
                value1: 'text'
            },
            {
                operator: 'notequals',
                name: 'LBL_OP_NOTEQUAL',
                value1: 'text'
            }, {
                operator: 'starts',
                name: 'LBL_STARTS',
                value1: 'text'
            }, {
                operator: 'contains',
                name: 'LBL_OP_CONTAINS',
                value1: 'text'
            }, {
                operator: 'ncontains',
                name: 'LBL_OP_NOTCONTAINS',
                value1: 'text'
            }, {
                operator: 'greater',
                name: 'LBL_OP_GREATER',
                value1: 'text'
            }, {
                operator: 'gequal',
                name: 'LBL_OP_GREATEREQUAL',
                value1: 'text'
            }, {
                operator: 'less',
                name: 'LBL_OP_LESS',
                value1: 'text'
            }, {
                operator: 'lequal',
                name: 'LBL_OP_LESSEQUAL',
                value1: 'text'
            }, {
                operator: 'between',
                name: 'LBL_OP_BETWEEN',
                value1: 'text',
                value2: 'text'
            }, {
                operator: 'empty',
                name: 'LBL_OP_EMPTY'
            }, {
                operator: 'notempty',
                name: 'LBL_OP_NOTEMPTY'
            }
        ],
        numeric: [
            {
                operator: 'equals',
                name: 'LBL_OP_EQUALS',
                value1: 'integer'
            },
            {
                operator: 'notequals',
                name: 'LBL_OP_NOTEQUAL',
                value1: 'text'
            }, {
                operator: 'greater',
                name: 'LBL_OP_GREATER',
                value1: 'integer'
            }, {
                operator: 'gequal',
                name: 'LBL_OP_GREATEREQUAL',
                value1: 'integer'
            }, {
                operator: 'less',
                name: 'LBL_OP_LESS',
                value1: 'integer'
            }, {
                operator: 'lequal',
                name: 'LBL_OP_LESSEQUAL',
                value1: 'integer'
            }, {
                operator: 'between',
                name: 'LBL_OP_BETWEEN',
                value1: 'integer',
                value2: 'integer'
            }
        ],
        date: [
            {
                operator: 'today',
                name: 'LBL_TODAY'
            },
            {
                operator: 'past',
                name: 'LBL_PAST'
            },
            {
                operator: 'future',
                name: 'LBL_FUTURE'
            },
            {
                operator: 'thismonth',
                name: 'LBL_THIS_MONTH'
            },
            {
                operator: 'thisyear',
                name: 'LBL_THIS_YEAR'
            },
            {
                operator: 'nextmonth',
                name: 'LBL_NEXT_MONTH'
            },
            {
                operator: 'nextyear',
                name: 'LBL_NEXT_YEAR'
            },
            {
                operator: 'ndaysago',
                name: 'LBL_N_DAYS_AGO',
                value1: 'integer'
            },
            {
                operator: 'inlessthanndays',
                name: 'LBL_IN_LESS_THAN_N_DAYS',
                value1: 'integer'
            },
            {
                operator: 'inlastndays',
                name: 'LBL_IN_THE_LAST_N_DAYS',
                value1: 'integer'
            },
            {
                operator: 'inmorethanndays',
                name: 'LBL_IN_MORE_THAN_N_DAYS',
                value1: 'integer'
            },
            {
                operator: 'inndays',
                name: 'LBL_IN_N_DAYS',
                value1: 'integer'
            },
            {
                operator: 'thisday',
                name: 'LBL_THIS_DAY'
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
            }, {
                operator: 'greater',
                name: 'LBL_OP_AFTER',
                value1: 'date'
            }, {
                operator: 'less',
                name: 'LBL_OP_BEFORE',
                value1: 'date'
            }, {
                operator: 'betweend',
                name: 'LBL_OP_BETWEEN',
                value1: 'date',
                value2: 'date'
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
            }, {
                operator: 'notempty',
                name: 'LBL_OP_NOTEMPTY'
            }, {
                operator: 'lastndays',
                name: 'LBL_OP_LASTNDAYS',
                value1: 'integer'
            }, {
                operator: 'lastnmonths',
                name: 'LBL_OP_LASTNMONTHS',
                value1: 'integer'
            }, {
                operator: 'untilyesterday',
                name: 'LBL_OP_UNTILYESTERDAY'
            }, {
                operator: 'fromtomorrow',
                name: 'LBL_OP_FROMTOMORROW'
            }
        ],
        bool: [
            {
                operator: 'true',
                name: 'LBL_TRUE'
            },
            {
                operator: 'false',
                name: 'LBL_FALSE'
            }
        ],
        enum: [
            {
                operator: 'equals',
                name: 'LBL_OP_EQUALS',
                value1: 'enum'
            },
            {
                operator: 'notequals',
                name: 'LBL_OP_NOTEQUAL',
                value1: 'enum'
            }, {
                operator: 'oneof',
                name: 'LBL_ONEOF',
                value1: 'multienum'
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
            }, {
                operator: 'notempty',
                name: 'LBL_OP_NOTEMPTY'
            }
        ],
        relate: [
            {
                operator: 'equalr',
                name: 'LBL_OP_EQUALS',
                value1: 'relate'
            }, {
                operator: 'emptyr',
                name: 'LBL_OP_ISEMPTY'
            }, {
                operator: 'notemptyr',
                name: 'LBL_OP_NOTEMPTY'
            }
        ]
    };

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
    ) {

    }

    /**
     * simple getter for the field of the expression
     */
    get field() {
        return this.filterexpression.field;
    }

    /**
     * sets the field and also triggers evaluation of the operator
     *
     * @param field
     */
    set field(field) {
        if (field != this.filterexpression.field) {
            this.filterexpression.field = field;

            // determine the operatorype and reset the operator
            this.determineOperatorType(field);

            // set a default operator
            this.operator = this.operators[this.operatortype][0].operator;

            // reset the fieldvalue
            this.filterexpression.filtervalue = '';
        }
    }

    /**
     * gets the operator
     */
    get operator() {
        return this.filterexpression.operator;
    }

    /**
     * sets the operator and resets the selected values
     *
     * @param operator
     */
    set operator(operator) {
        if (operator != this.filterexpression.operator) {
            this.filterexpression.operator = operator;
            this.filterexpression.filtervalue = '';
            this.filterexpression.filtervalueto = '';
        }
    }

    /**
     * determine the operator type based on the field type
     *
     * @param field
     */
    private determineOperatorType(field) {
        let fieldtype = this.metadata.getFieldDefs(this.module, field);
        if (!fieldtype) {
            this.operatortype = 'default';
            return;
        }
        switch (fieldtype.type) {
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                this.operatortype = 'date';
                break;
            case 'bool':
            case 'boolean':
                this.operatortype = 'bool';
                break;
            case 'enum':
            case 'multienum':
                this.operatortype = 'enum';
                break;
            case 'int':
            case 'double':
            case 'currency':
                this.operatortype = 'numeric';
                break;
            case 'relate':
                this.operatortype = 'relate';
                break;
            default:
                this.operatortype = 'default';
                break;
        }
    }

    /**
     * load the fields and sort them
     */
    public ngOnInit() {
        // set the initial operatortype
        this.determineOperatorType(this.field);
    }

    /**
     * delete the filter expression
     */
    private delete() {
        this.filterexpression.deleted = true;
        this.expressionDeleted.emit(true);
    }

    /**
     * trackby fn for the ngFor loop
     *
     * @param i
     * @param item
     */
    private trackByFn(i, item) {
        return item.value;
    }
}
