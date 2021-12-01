/**
 * @module WorkbenchModule
 */
import {
    Component, forwardRef, Input, OnDestroy, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var _: any;

@Component({
    selector: 'system-filter-builder',
    templateUrl: '../templates/systemfilterbuilder.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemFilterBuilder),
            multi: true
        }
    ]
})
export class SystemFilterBuilder implements ControlValueAccessor {

    /**
     * the module for the filter
     */
    @Input() public module: string;

    /**
     * for the cvalue accessor
     */
    public onChange: (value: any) => void;

    /**
     * for the cvalue accessor
     */
    public onTouched: () => void;

    public _conditions = {
        logicaloperator: 'and',
        groupscope: 'all',
        conditions: []
    };

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        if (value && !_.isEmpty(value)) {
            let conditions = {
                logicaloperator: value.logicaloperator,
                groupscope: value.groupscope,
                conditions: [...value.conditions],
            }
            this._conditions = conditions;
        }
    }

    public expressionChanged() {
        let newFilterGroupCondition = [];
        for (let filterGroupCondition of this._conditions.conditions) {
            if (filterGroupCondition.deleted !== true) {
                newFilterGroupCondition.push(filterGroupCondition);
            }
        }
        this._conditions.conditions = newFilterGroupCondition;

        if (!_.isEmpty(this._conditions.conditions)) {
            this.onChange({...this._conditions});
        } else {
            this.onChange(null);
        }
    }

}
