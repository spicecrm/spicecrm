/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * a generic input for a fieldset that allows filtering by module and displays a select with custom and global items
 */
@Component({
    selector: "system-input-fieldset",
    templateUrl: "../templates/systeminputfieldset.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputFieldset),
            multi: true
        }
    ]
})
export class SystemInputFieldset implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * hods the fieldset
     */
    public _fieldset: string;

    /**
     * the fieldsets available
     */
    public _fieldsets: any[] = [];

    /**
     * the current module
     */
    public _module: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
    ) {
        this._fieldsets = this.metadata.getFieldSets();
    }

    /**
     * a getter for the fieset itself
     */
    get fieldset() {
        return this._fieldset;
    }

    /**
     * a setter for the fieldset - also trigers the onchange
     *
     * @param fieldset the iod of the fieldset
     */
    set fieldset(fieldset) {
        this._fieldset = fieldset;
        this.onChange(fieldset);
    }

    /**
     * sets the module from a selected fieldset
     */
    public detectModule() {
        // set the module if a fieldset is set
        if (this._fieldset) {
            this._module = this.metadata.getFieldset(this._fieldset).module;
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
        this._fieldset = value;

        // determine the module from the fieldset
        this.detectModule();
    }

}
