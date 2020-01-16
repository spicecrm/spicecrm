/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-password',
    templateUrl: './src/systemcomponents/templates/systeminputpassword.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputPassword),
            multi: true
        }
    ]
})
export class SystemInputPassword implements ControlValueAccessor {

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    private _value: string;

    private _inputtype: 'text' | 'password' = 'password';

    /**
     * set to disabled
     */
    @Input() private disabled: boolean = false;

    constructor() {

    }

    /**
     * ghetter for the value
     */
    get value() {
        return this._value;
    }

    /**
     * setter for the value that also emits the new value
     * @param value
     */
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
     * if disablöed alsways set to password
     */
    get inputtype(){
        return this.disabled ? 'password' : this._inputtype;
    }

    /**
     * toggle the type
     */
    private toggleType() {
        this._inputtype = this._inputtype == 'text' ? 'password' : 'text';
    }

    /**
     * getter for the icon
     */
    get toggleicon() {
        return this.inputtype == 'text' ? 'hide' : 'preview';
    }

}
