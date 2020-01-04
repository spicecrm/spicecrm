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
    templateUrl: './src/systemcomponents/templates/systeminputradio.html',
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
    @Input() private name: string;

    /**
     * the value to be set
     */
    @Input() private value: any;

    /**
     * the value to be set
     */
    @Input() private disabled: boolean = false;

    /**
     * for the control accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * internal variable if checked
     */
    private checked: any;

    /**
     * internal generated id to be used for the Radio Button in the Lightning Design
     */
    private id: string;

    constructor(private modelutilities: modelutilities) {
        this.id = this.modelutilities.generateGuid();
    }

    /**
     * set the radio button toi checked
     */
    private setChecked(event) {
        console.log(event);
        if (event.srcElement.checked) {
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
