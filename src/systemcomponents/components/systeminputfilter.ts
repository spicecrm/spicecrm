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
    selector: "system-input-filter",
    templateUrl: "../templates/systeminputfilter.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputFlter),
            multi: true
        }
    ]
})
export class SystemInputFlter implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    /**
     * to disable the checkbox
     */
    public _disabled = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * hods the fieldset
     */
    public _filter: string;

    /**
     * the fieldsets available
     */
    public _filters: any[] = [];

    /**
     * the current module
     */
    public _module: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
    ) {
        this._filters = this.metadata.getFilters();
    }

    get filterModules(){
        let filterModules =  [...new Set(this.metadata.getFilters().map(f => f.module))];
        return filterModules;
    }

    /**
     * a getter for the filter itself
     */
    get filter() {
        return this._filter;
    }

    get module(){
        return this._module;
    }

    set module(module){
        this._module = module;
        this.filter = undefined;
    }

    /**
     * a setter for the filter - also trigers the onchange
     *
     * @param filter the iod of the fieldset
     */
    set filter(filter) {
        this._filter = filter;
        this.onChange(filter);
    }

    /**
     * sets the module from a selected fieldset
     */
    public detectModule() {
        // set the module if a fieldset is set
        if (this._filter) {
            this._module = this.metadata.getFilter(this._filter).module;
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
        this._filter = value;

        // determine the module from the fieldset
        this.detectModule();
    }

}
