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
    templateUrl: '../templates/systemfilterbuilderfilterexpression.html',
})
export class SystemFilterBuilderFilterExpression implements OnInit {

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the durrect set filter expression
     */
    @Input() public filterexpression: any = {};

    /**
     * the selected operator type .. this is determined by the field definitions
     */
    public operatortype = 'default';

    @Output() public expressionDeleted: EventEmitter<any> = new EventEmitter<any>();

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
            }, {
                operator: 'nyearsago',
                name: 'LBL_N_YEARS_AGO',
                value1: 'integer'
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
                operator: 'notoneof',
                name: 'LBL_NOTONEOF',
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
                operator: 'notequalr',
                name: 'LBL_OP_NOTEQUAL',
                value1: 'relate'
            }, {
                operator: 'emptyr',
                name: 'LBL_OP_ISEMPTY'
            }, {
                operator: 'notemptyr',
                name: 'LBL_OP_NOTEMPTY'
            }, {
                operator: 'equalrcu',
                name: 'LBL_CURRENT_USER',
            }, {
                operator: 'notequalrcu',
                name: 'LBL_NOT_CURRENT_USER',
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
    public determineOperatorType(field) {
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
    public delete() {
        this.filterexpression.deleted = true;
        this.expressionDeleted.emit(true);
    }

    /**
     * trackby fn for the ngFor loop
     *
     * @param i
     * @param item
     */
    public trackByFn(i, item) {
        return item.value;
    }
}
