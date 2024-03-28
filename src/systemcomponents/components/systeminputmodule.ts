/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
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
export class SystemInputModule implements ControlValueAccessor, OnDestroy, OnInit {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() public technicalNameOnly: boolean = true;

    /**
     * for generic selections show an '*' as option
     */
    @Input() public displayAsterisk: boolean = false;

    /**
     * filter modules input local property
     * @private
     */
    private _filterModules: string[] = [];
    /**
     * filter out the given modules array
     * @param value
     */
    @Input() set filterModules(value:string[]){
        this._filterModules = value;
        // this._modules = this._modules.filter(m => !value.find(v => v == m.id));
    }
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
    public _module: {id: string, name: string};

    /**
     * the available companycodes
     */
    public _modules: {id: string, name: string}[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public configuration: configurationService
    ) {
        // resort in case of Language change
        this.subscription = this.language.currentlanguage$.subscribe((language) => {
            this.sortModules();
        });
    }

    public ngOnInit() {
        this._modules = this.metadata.getModules().map(m => ({id: m, name: this.technicalNameOnly ? m : `${this.language.getModuleName(m)} (${m})`}));

        if (this._filterModules.length > 0) {
            this._modules = this._modules.filter(m => this._filterModules.find(v => v == m.id));
        }

        if (this.displayAsterisk) {
            this._modules.unshift({id: '*', name: '*'});
        }

        this.sortModules();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public sortModules() {
        if(this.technicalNameOnly){
            this._modules.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        } else {
            this._modules.sort((a, b) => this.language.getModuleName(a.id).toLowerCase() > this.language.getModuleName(b.id).toLowerCase() ? 1 : -1);
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
     * @param module
     */
    set module(module: {id: string, name: string}) {
        this._module = module;
        if (this.onChange) {
            this.onChange(module?.id);
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

        if (!value) return;

        this._module = {id: value, name: this.technicalNameOnly ? value : `${this.language.getModuleName(value)} (${value})`};
    }

}
