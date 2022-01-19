/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {modelutilities} from "../../services/modelutilities.service";

/**
 * a radio button with the Lightning Design
 */
@Component({
    selector: 'system-input-radio',
    templateUrl: '../templates/systeminputradio.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRadio),
            multi: true
        }
    ]
})
export class SystemInputRadio implements ControlValueAccessor {

    /**
     * the name for the radio button
     */
    @Input() public name: string;

    /**
     * the value to be set
     */
    @Input() public value: any;

    /**
     * the value to be set
     */
    @Input() public disabled: boolean = false;

    /**
     * for the control accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * internal variable if checked
     */
    public checked: any;

    /**
     * internal generated id to be used for the Radio Button in the Lightning Design
     */
    public id: string;

    constructor(public modelutilities: modelutilities) {
        this.id = this.modelutilities.generateGuid();
    }

    /**
     * set the radio button toi checked
     */
    public setChecked(event) {
        if (event.target.checked) {
            this.onChange(this.value);
        }
    }

    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        if (value && value == this.value) {
            this.checked = true;
        } else {
            this.checked = false;
        }
    }
}
