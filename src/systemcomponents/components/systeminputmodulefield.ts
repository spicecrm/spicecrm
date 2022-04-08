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
    selector: "system-input-module-field",
    templateUrl: "../templates/systeminputmodulefield.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModuleField),
            multi: true
        }
    ]
})
export class SystemInputModuleField implements ControlValueAccessor, OnInit, OnDestroy {

    /**
     * input to disable the input
     */
    @Input() public module: string;
    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() public displaytechnicalname: boolean = true;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * holds the field
     */
    public _field: string;

    /**
     * the available fields
     */
    public _fields: any[] = [];

    public subscription: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public configuration: configurationService
    ) {

    }

    public ngOnInit(): void {
        let fields = this.metadata.getModuleFields(this.module);

        for (let field in fields) {
            this._fields.push(field);
        }

        this.sortFields();

        // resort in case of Language change
        this.subscription = this.language.currentlanguage$.subscribe((language) => {
            this.sortFields();
        });
    }

    public sortFields() {
        this._fields.sort((a, b) => this.language.getFieldDisplayName(this.module, a).toLowerCase() > this.language.getFieldDisplayName(this.module, b).toLowerCase() ? 1 : -1);
    }

    /**
     * a getter for the companycode itself
     */
    get field() {
        return this._field;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param companycode the id of the companycode
     */
    set field(field) {
        this._field = field;
        if (this.onChange) {
            this.onChange(field);
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
        this._field = value;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
