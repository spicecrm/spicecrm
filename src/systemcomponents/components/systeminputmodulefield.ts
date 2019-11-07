/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-module-field",
    templateUrl: "./src/systemcomponents/templates/systeminputmodulefield.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModuleField),
            multi: true
        }
    ]
})
export class SystemInputModuleField implements ControlValueAccessor, OnInit {

    /**
     * input to disable the input
     */
    @Input() private module: string;
    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() private displaytechnicalname: boolean = true;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * holds the field
     */
    private _field: string;

    /**
     * the available fields
     */
    private _fields: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private configuration: configurationService
    ) {

    }

    public ngOnInit(): void {
        let fields = this.metadata.getModuleFields(this.module);

        for (let field in fields) {
            this._fields.push(field);
        }

        this.sortFields();

        // resort in case of Language change
        this.language.currentlanguage$.subscribe((language) => {
            this.sortFields();
        });
    }

    private sortFields() {
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

}
