/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";
import {Subscription} from "rxjs";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-module",
    templateUrl: "../templates/systeminputmodule.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModule),
            multi: true
        }
    ]
})
export class SystemInputModule implements ControlValueAccessor, OnDestroy {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() public displaytechnicalname: boolean = true;

    /**
     * for generic selections show an '*' as option
     */
    @Input() public displayAsterisk: boolean = false;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * holds all subscriptions
     *
     * @private
     */
    public subscription: Subscription = new Subscription();
    /**
     * holds the companycoded
     */
    public _module: string;

    /**
     * the available companycodes
     */
    public _modules: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public configuration: configurationService
    ) {
        this._modules = this.metadata.getModules();
        this.sortModules();

        // resort in case of Language change
        this.subscription = this.language.currentlanguage$.subscribe((language) => {
            this.sortModules();
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public sortModules() {
        if(this.displaytechnicalname){
            this._modules.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
        } else {
            this._modules.sort((a, b) => this.language.getModuleName(a).toLowerCase() > this.language.getModuleName(b).toLowerCase() ? 1 : -1);
        }
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
