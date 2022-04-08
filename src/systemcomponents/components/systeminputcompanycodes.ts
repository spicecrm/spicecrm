/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-companycodes",
    templateUrl: "../templates/systeminputcompanycodes.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputCompanycodes),
            multi: true
        }
    ]
})
export class SystemInputCompanycodes implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * holds the companycoded
     */
    public _companycode: string;

    /**
     * the available companycodes
     */
    public _companycodes: any[] = [];

    constructor(
        public language: language,
        public configuration: configurationService
    ) {
        this._companycodes = this.configuration.getData('companycodes');
        if(typeof this._companycodes === 'object') {
            this._companycodes.sort((a, b) => a.name > b.name ? -1 : 1);
        }
    }

    /**
     * a getter for the companycode itself
     */
    get companycode() {
        return this._companycode;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param companycode the id of the companycode
     */
    set companycode(companycode) {
        this._companycode = companycode;
        if (this.onChange) {
            this.onChange(companycode);
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
        this._companycode = value;
    }

}
