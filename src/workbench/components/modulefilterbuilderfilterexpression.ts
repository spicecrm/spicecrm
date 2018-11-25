import {
    Component, Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'module-filter-builder-expression',
    templateUrl: './src/workbench/templates/modulefilterbuilderfilterexpression.html',
})
export class ModuleFilterBuilderFilterExpression implements OnInit {

    @Input() private module: string;
    @Input() private filterexpression: any = {}

    private fields: any[] = [];
    private operatortype = 'default';

    private operators = {
        default: [
            {
                operator: 'equals',
                name: 'LBL_EQUALS'
            }, {
                operator: 'starts',
                name: 'LBL_STARTS'
            }, {
                operator: 'contains',
                name: 'LBL_OP_CONTAINS'
            }, {
                operator: 'ncontains',
                name: 'LBL_OP_NOTCONTAINS'
            }, {
                operator: 'greater',
                name: 'LBL_OP_GREATER'
            }, {
                operator: 'gequal',
                name: 'LBL_OP_GREATEREQUAL'
            }, {
                operator: 'less',
                name: 'LBL_OP_LESS'
            }, {
                operator: 'lequal',
                name: 'LBL_OP_LESSEQUAL'
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
                name: 'LBL_EQUALS'
            }, {
                operator: 'oneof',
                name: 'LBL_ONEOF'
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
            this.determineoperatortype(field);
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

    private determineoperatortype(field) {
        let fieldtype = this.metadata.getFieldDefs(this.module, field);
        switch (fieldtype.type) {
            case 'date':
            case 'datetime':
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

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {
            this.fields.push(fields[field]);
        }

        // set the initial operatortype
        this.determineoperatortype(this.field);
    }

    private delete() {
        this.filterexpression.deleted = true;
    }
}
