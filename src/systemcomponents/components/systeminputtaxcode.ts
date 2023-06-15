/**
 * @module SystemComponents
 */
import {
    Component, forwardRef, Input,  OnInit
} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-taxcode',
    templateUrl: '../templates/systeminputtaxcode.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputTaxCode),
            multi: true
        }
    ]
})
export class SystemInputTaxCode implements OnInit, ControlValueAccessor {

    /**
     * holds the passed disabled boolean
     */
    @Input() public disabled: boolean = false;

    /**
     * the options from the enum
     */
    public taxcodes: any[] = [];

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the value
     */
    public _value: string;


    constructor(
        public configuration: configurationService
    ) {

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
     * initially load the taxcodes
     */
    public ngOnInit(): void {
        this.getTaxCodes();
    }

    /**
     * get the taxcodes
     */
    public getTaxCodes() {
        // get all where the countery is int eh list of countries or the country is empty
        this.taxcodes = this.configuration.getData('salesdoctaxcategories');
    }

}
