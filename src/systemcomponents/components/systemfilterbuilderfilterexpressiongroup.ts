/**
 * @module WorkbenchModule
 */
import {
    Component, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-filter-builder-expression-group',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpressiongroup.html',
})
export class SystemFilterBuilderFilterExpressionGroup implements OnChanges {

    @Input() private module: string;
    @Input() private filtergroup: any;
    @Input() private candelete: boolean = false;

    private expressions: any[] = [];
    private groups: any[] = [];

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata
    ) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.groups = [];
        this.expressions = [];
        for (let conditon of this.filtergroup.conditions) {
            if (conditon.logicaloperator) {
                this.groups.push((conditon));
            } else {
                this.expressions.push(conditon);
            }
        }
    }

    private addExpression() {
        let expression = {
            field: '',
            operator: '',
            filtervalue: ''
        };
        this.filtergroup.conditions.push(expression);
        this.expressions.push(expression);
    }

    private addGroup() {
        let group = {
            logicaloperator: 'and',
            groupscope: 'all',
            conditions: []
        };
        this.filtergroup.conditions.push(group);
        this.groups.push(group);
    }


    private delete() {
        this.filtergroup.deleted = true;
    }

}
