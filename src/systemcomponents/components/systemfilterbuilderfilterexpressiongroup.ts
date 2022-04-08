/**
 * @module WorkbenchModule
 */
import {
    Component, Input, OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-filter-builder-expression-group',
    templateUrl: '../templates/systemfilterbuilderfilterexpressiongroup.html',
})
export class SystemFilterBuilderFilterExpressionGroup implements OnChanges {

    @Input() public module: string;
    @Input() public filtergroup: any;
    @Input() public candelete: boolean = false;

    @Output() public expressionChanged: EventEmitter<any> = new EventEmitter<any>();

    public expressions: any[] = [];
    public groups: any[] = [];

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata
    ) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.groups = [];
        this.expressions = [];
        for (let conditon of this.filtergroup.conditions) {
            if (conditon.logicaloperator) {
                this.groups.push(conditon);
            } else {
                this.expressions.push(conditon);
            }
        }
    }

    public addExpression() {
        let expression = {
            field: '',
            operator: '',
            filtervalue: ''
        };
        this.filtergroup.conditions.push(expression);
        this.expressions.push(expression);

        this.expressionChanged.emit(true);
    }

    public addGroup() {
        let group = {
            logicaloperator: 'and',
            groupscope: 'all',
            conditions: []
        };
        this.filtergroup.conditions.push(group);
        this.groups.push(group);
    }


    public delete() {
        this.filtergroup.deleted = true;
        this.expressionChanged.emit(true);
    }

    public filterchanged() {
        this.cleanDeleted();
        this.expressionChanged.emit(true);
    }

    public cleanDeleted() {
        let newFilterGroupCondition = [];
        for (let filterGroupCondition of this.filtergroup.conditions) {
            if (filterGroupCondition.deleted !== true) {
                newFilterGroupCondition.push(filterGroupCondition);
            }
        }
        this.filtergroup.conditions = newFilterGroupCondition;
    }

}
