/**
 * @module SystemComponents
 */
import {
    Component, forwardRef, Input,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-slider',
    templateUrl: '../templates/systemslider.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemSlider),
            multi: true
        }
    ]
})
export class SystemSlider implements ControlValueAccessor {

    /**
     * for the value accessor
     */
    public onChange: (value: number) => void;
    public onTouched: () => void;

    @Input() public max: string;
    @Input() public min: string;
    @Input() public step: string;
    @Input() public disabled: boolean = false;
    @Input() public displayValue: boolean = true;


    public _value: number = 0;


    constructor() {
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (value != this._value) {
            this._value = value;
            this.onChange(value);
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
    }
    /**
    * disable the element
    * @param isDisabled The disabled status to set on the element
    */

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
