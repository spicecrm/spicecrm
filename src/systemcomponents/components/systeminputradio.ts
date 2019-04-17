/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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

    @Input() private name: string;
    @Input() private value: any;

    private onChange: (value: string) => void;
    private onTouched: () => void;
    private checked: any;
    private id: string;

    constructor() {
        this.id = this.generateGuid();
    }

    private setChecked(event) {
        console.log(event);
        if (event.srcElement.checked) {
            this.onChange(this.value);
        }
    }

    /*
     * for the GUID Generation
    */
    private getRand() {
        return Math.random();
    }

    private S4() {
        return (((1 + this.getRand()) * 0x10000) | 0).toString(16).substring(1);
    }

    public generateGuid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
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