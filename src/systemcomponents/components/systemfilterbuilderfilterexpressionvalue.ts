/**
 * @module WorkbenchModule
 */
import {
    AfterViewInit,
    Component, forwardRef, Input, OnChanges, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var moment: any;

@Component({
    selector: 'system-filter-builder-expression-value',
    templateUrl: '../templates/systemfilterbuilderfilterexpressionvalue.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemFilterBuilderFilterExpressionValue),
            multi: true
        }
    ]
})
export class SystemFilterBuilderFilterExpressionValue implements ControlValueAccessor {

    /**
     * a reference to the value container
     */
    // @ViewChild("valueContainer", {read: ViewContainerRef, static: false}) public valueContainer: ViewContainerRef;

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the field
     */
    @Input() public field: string;


    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the module we are attaching this filter to
     */
    @Input() public valueType: string;

    /**
     * the value
     */
    public _value: any;

    constructor(
        public metadata: metadata,
    ) {

    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        switch (this.valueType) {
            case 'date':
                this.onChange(value.format('YYYY-MM-DD'));
                break;
            case 'multienum':
                this.onChange(value.join(','));
                break;
            default:
                this.onChange(value);
                break;
        }
    }


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
        this._value = value;
        switch (this.valueType) {
            case 'date':
                this._value = new moment(value);
                break;
            case 'multienum':
                this._value = value ? value.split(',') : [];
                break;
            default:
                this._value = value;
                break;
        }
    }

    get relatedmodule() {
        return this.metadata.getFieldDefs(this.module, this.field).module;
    }

}
