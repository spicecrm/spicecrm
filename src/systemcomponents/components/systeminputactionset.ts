/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * a generic input for an action that allows filtering by module and displays a select with custom and global items
 */
@Component({
    selector: "system-input-actionset",
    templateUrl: "../templates/systeminputactionset.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputActionset),
            multi: true
        }
    ]
})
export class SystemInputActionset implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * hods the componentset
     */
    public _actionset: string;

    /**
     * the fieldsets available
     */
    public _actionsets: any[] = [];

    /**
     * the current module
     */
    public _module: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
    ) {
        this._actionsets = this.metadata.getActionSets();
    }

    /**
     * a getter for the actionset itself
     */
    get actionset() {
        return this._actionset;
    }

    /**
     * a setter for the actionset - also trigers the onchange
     *
     * @param actionset the iod of the fieldset
     */
    set actionset(actionset) {
        this._actionset = actionset;
        this.onChange(actionset);
    }

    /**
     * sets the module from a selected fieldset
     */
    public detectModule() {
        // set the module if a fieldset is set
        if (this._actionset) {
            this._module = this.metadata.getActionSet(this._actionset).module;
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
        this._actionset = value;

        // determine the module from the fieldset
        this.detectModule();
    }

}
