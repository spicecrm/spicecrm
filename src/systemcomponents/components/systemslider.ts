/**
 * @module SystemComponents
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-slider',
    templateUrl: './src/systemcomponents/templates/systemslider.html',
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
    private onChange: (value: string) => void;
    private onTouched: () => void;

    @Input() private _max: string;
    @Input() private _min: string;
    @Input() private _step: string;
    @Input() private disabled: boolean = false;


    private _value: string;


    constructor( private language: language) {}

    get value() {
        return this._value;
    }

    set value(value) {
        if (value != this._value) {
            this._value = value;
            this.onChange(value);
        }
    }

    get max() {
        return this._max;
    }

    get min() {
        return this._min;
    }

    get step() {
        return this._step;
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

}
