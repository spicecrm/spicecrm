/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * a generic input for a fieldset that allows filtering by module and displays a select with custom and global items
 */
@Component({
    selector: "system-input-componentset",
    templateUrl: "../templates/systeminputcomponentset.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputComponentset),
            multi: true
        }
    ]
})
export class SystemInputComponentset implements ControlValueAccessor {


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
     * hods the componentset
     */
    public _componentset: string;

    /**
     * the fieldsets available
     */
    public _componentsets: any[] = [];

    /**
     * internal held for the modules
     */
    public _modules: any[] = [];

    /**
     * the current module
     */
    public _module: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
    ) {
        this._componentsets = this.metadata.getComponentSets();
        this._modules = this.metadata.getModules();
        this._modules.sort();
    }

    /**
     * a getter for the fieset itself
     */
    get componentset() {
        return this._componentset;
    }

    /**
     * a setter for the fieldset - also trigers the onchange
     *
     * @param fieldset the iod of the fieldset
     */
    set componentset(componentset) {
        this._componentset = componentset;
        this.onChange(componentset);
    }

    /**
     * sets the module from a selected fieldset
     */
    public detectModule() {
        // set the module if a fieldset is set
        if (this._componentset) {
            this._module = this.metadata.getComponentSet(this._componentset).module;
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
        this._componentset = value;

        // determine the module from the fieldset
        this.detectModule();
    }

}
