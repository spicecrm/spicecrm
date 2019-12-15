/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-module",
    templateUrl: "./src/systemcomponents/templates/systeminputmodule.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModule),
            multi: true
        }
    ]
})
export class SystemInputModule implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() private displaytechnicalname: boolean = true;

    /**
     * for generic selections show an '*' as option
     */
    @Input() private displayAsterisk: boolean = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * holds the companycoded
     */
    private _module: string;

    /**
     * the available companycodes
     */
    private _modules: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private configuration: configurationService
    ) {
        this._modules = this.metadata.getModules();
        this.sortModules();

        // resort in case of Language change
        this.language.currentlanguage$.subscribe((language) => {
            this.sortModules();
        });
    }

    private sortModules() {
        this._modules.sort((a, b) => this.language.getModuleName(a).toLowerCase() > this.language.getModuleName(b).toLowerCase() ? 1 : -1);
    }

    /**
     * a getter for the companycode itself
     */
    get module() {
        return this._module;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param companycode the id of the companycode
     */
    set module(module) {
        this._module = module;
        if (this.onChange) {
            this.onChange(module);
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
        this._module = value;
    }

}
