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
    public _field: {id: string, name: string};

    /**
     * the available fields
     */
    public _fields: {id: string, name: string}[] = [];

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

            // skip the omitted fields
            if (this.omittedFields.some(f => fields[field].name == f)) continue;

            this._fields.push({
                id: fields[field].name,
                name: this.getFieldDisplay(fields[field].name)
            });
        }

        this.sortFields();

        // resort in case of Language change
        this.subscription = this.language.currentlanguage$.subscribe((language) => {
            this.sortFields();
        });
    }

    /**
     * holds the omitted fields array
     * @private
     */
    private omittedFields: string[] = [];
    /**
     * set the omitted fields
     * @param arr
     */
    @Input('omittedFields')
    set omittedFieldsInput(arr: string[]) {
        this.omittedFields = arr;
        this._fields = this._fields.filter(f => this._field?.id == f.id || !arr.some(fo => fo == f.id));
    }

    /**
     * get field display value
     * @param fieldName
     * @private
     */
    private getFieldDisplay(fieldName: string): string {
        return this.language.getFieldDisplayName(this.module, fieldName) + (!this.displaytechnicalname ? '' : ` (${fieldName})`);
    }

    public sortFields() {
        this._fields.sort((a, b) => this.language.getFieldDisplayName(this.module, a.name).toLowerCase() > this.language.getFieldDisplayName(this.module, b.name).toLowerCase() ? 1 : -1);
    }

    /**
     * a getter for the companycode itself
     */
    get field(): {id: string, name: string} {
        return this._field;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param field
     */
    set field(field: {id: string, name: string}) {
        this._field = field;
        if (this.onChange) {
            this.onChange(field?.id);
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
        this._field = !value ? undefined : {id: value, name: this.getFieldDisplay(value)};
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
