/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-filter-builder-expression-values',
    templateUrl: '../templates/systemfilterbuilderfilterexpressionvalues.html',
})
export class SystemFilterBuilderFilterExpressionValues implements OnChanges {

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the field
     */
    @Input() public field: string;

    /**
     * the operator
     */
    @Input() public operator: any;
    @Input() public operators: any[];

    /**
     * the durrect set filter expression
     */
    @Input() public filterexpression: any = {};

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
    ) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
    }

    get value1() {
        let operator = this.operators.find(op => op.operator == this.operator);
        return operator.value1;
    }

    get value2() {
        let operator = this.operators.find(op => op.operator == this.operator);
        return operator.value2;
    }

    /**
     * returns if any of the two value is set
     */
    public showValues() {
        return this.operator.value1 || this.operator.value2;
    }

}
