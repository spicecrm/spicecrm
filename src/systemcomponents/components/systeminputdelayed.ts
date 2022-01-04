/**
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component, ElementRef,
    forwardRef,
    Input
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var moment: any;


/**
 * a generic component that renders an input field with a delay
 */
@Component({
    selector: "system-input-delayed",
    templateUrl: "../templates/systeminputdelayed.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDelayed),
            multi: true
        }
    ]
})
export class SystemInputDelayed implements ControlValueAccessor {

    /**
     * @ignore
     *
     * for the vlaue accessor
     */
    public onChange: (value: string) => void;

    /**
     * @ignore
     *
     * for the vlaue accessor
     */
    public onTouched: () => void;

    /**
     * @ignore
     *
     * keeps the value internally
     */
    public _value: string;

    /**
     * @ignore
     *
     * the timeout function
     */
    public _modeltimeout: any;

    /**
     * the delay the model update is fired after the value has changed
     */
    @Input() public delay: number = 500;

    /**
     * @ignore
     *
     * funnel through the placeholder
     */
    @Input() public placeholder: string = '';

    /**
     * getter for the value
     */
    get value() {
        return this._value;
    }

    /**
     * the setter for the value
     *
     * @param newValue the new value received
     */
    set value(newValue) {
        this._value = newValue;
        if (this._modeltimeout) window.clearTimeout(this._modeltimeout);
        this._modeltimeout = window.setTimeout(() => this.onChange(this._value), this.delay);
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
