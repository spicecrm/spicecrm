/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

const ngValueAccessor = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SystemInputBase64),
    multi: true
};

@Component({
    selector: 'system-input-base64',
    templateUrl: '../templates/systeminputbase64.html',
    providers: [ngValueAccessor]
})

export class SystemInputBase64 {

    @Input() public minHeight: number = 150;
    @Input() public maxHeight: number = 500;
    @Input() public disabled: boolean = false;

    public onChange: (value: string) => void;
    public onTouched: () => void;

    public _value: string = '';

    get value() {
        if(this._value && this._value != '') {
            try {
                return decodeURIComponent(window.atob(this._value));
            } catch (e) {
                try {
                    return window.atob(this._value);
                } catch (e) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    set value(val) {
        this._value = window.btoa(val);
        if (typeof this.onChange === 'function') {
            this.onChange(this._value);
        }
    }

    get textAreaStyle() {
        return {
            'min-height': this.minHeight + 'px',
            'max-height': this.maxHeight + 'px'
        };
    }

    /*
    * ControlValueAccessor Interface
    */
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /*
    * ControlValueAccessor Interface
    */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this._value = value;
    }
}
