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
    @Input() private module: string;

    /**
     * the durrect set filter expression
     */
    @Input() private filterexpression: any = {};

    public fields: any[] = [];

    /**
     * the selected operator type .. this is determined by the field definitions
     */
    private operatortype = 'default';

    @Output() private expressionDeleted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the operators available also grouped by type
     */
    private operators = {
        default: [
            {
                operator: 'equals',
                name: 'LBL_EQUALS',
                capturevalue: true
            }, {
                operator: 'starts',
                name: 'LBL_STARTS',
                capturevalue: true
            }, {
                operator: 'contains',
                name: 'LBL_OP_CONTAINS',
                capturevalue: true
            }, {
                operator: 'ncontains',
                name: 'LBL_OP_NOTCONTAINS',
                capturevalue: true
            }, {
                operator: 'greater',
                name: 'LBL_OP_GREATER',
                capturevalue: true
            }, {
                operator: 'gequal',
                name: 'LBL_OP_GREATEREQUAL',
                capturevalue: true
            }, {
                operator: 'less',
                name: 'LBL_OP_LESS',
                capturevalue: true
            }, {
                operator: 'lequal',
                name: 'LBL_OP_LESSEQUAL',
                capturevalue: true
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
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
                capturevalue: true
            },
            {
                operator: 'inlessthandays',
                name: 'LBL_IN_LESS_THAN_N_DAYS',
                capturevalue: true
            },
            {
                operator: 'inmorethandays',
                name: 'LBL_IN_MORE_THAN_N_DAYS',
                capturevalue: true
            },
            {
                operator: 'inndays',
                name: 'LBL_IN_N_DAYS',
                capturevalue: true
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
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
                name: 'LBL_EQUALS',
                capturevalue: true
            }, {
                operator: 'oneof',
                name: 'LBL_ONEOF',
                capturevalue: true
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
            }
        ]
    }

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
    ) {

    }

    get field() {
        return this.filterexpression.field;
    }

    set field(field) {
        if (field != this.filterexpression.field) {
            this.filterexpression.field = field;

            // determine the operatorype and reset the operator
            this.determineOperatorType(field);
            this.operator = '';

            // reset the fieldvalue
            this.filterexpression.filtervalue = '';
        }
    }

    get operator() {
        return this.filterexpression.operator;
    }

    set operator(operator) {
        if (operator != this.filterexpression.operator) {
            this.filterexpression.operator = operator;
            this.filterexpression.filtervalue = '';
        }
    }

    get enumValue() {
        let val = this.filterexpression.filtervalue;
        if (val && typeof val != 'string') {
            return val;
        }
        return this.filterexpression.filtervalue = val.length > 1 ? val.split(',') : [val];
    }

    set enumValue(value) {
        this.filterexpression.filtervalue = value.length > 1 ? value.join(',') : value.toString();

    }

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
            default:
                this.operatortype = 'default';
                break;
        }
    }

    /**
     * determines based on teh operator definition if the value field should be shown or not to allow the user to enter a value
     */
    private showValueField() {
        let showValueField: boolean = false;
        this.operators[this.operatortype].some(operator => {
                if (this.filterexpression.operator == operator.operator) {
                    showValueField = operator.capturevalue;
                    return true;
                }
            }
        )
        return showValueField;
    }

    private enumDisabled() {
        return this.operatortype == 'enum' && this.filterexpression.operator != 'equals';
    }

    private getFieldDisplayOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.module, this.field);
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        return retArray.filter(item => item.value.length > 0);
    }

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {
            this.fields.push(fields[field]);
        }

        // sort by name
        this.fields.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });

        // set the initial operatortype
        this.determineOperatorType(this.field);
    }

    private delete() {
        this.filterexpression.deleted = true;
        this.expressionDeleted.emit(true);
    }

    private trackByFn(i, item) {
        return item.value;
    }
}
