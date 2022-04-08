/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {configurationService} from "../../services/configuration.service";
import {language} from "../../services/language.service";

/**
 * renders a select fiield with the units of measure availabe in the system
 */
@Component({
    selector: 'system-select-uom',
    templateUrl: '../templates/systemselectuom.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemSelectUOM),
            multi: true
        }
    ]
})
export class SystemSelectUOM implements ControlValueAccessor {

    /**
     * holds the UOMs retrived from teh config
     */
    public uoms: any[] = [];

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * allow the select to be disabled
     */
    @Input() public disabled: boolean = false;

    /**
     * the internal held value
     */
    public _uom: string = '';

    constructor(public configuration: configurationService, public language: language) {
        this.uoms = this.configuration.getData('uomunits');
    }

    /**
     * getter for the select
     */
    get uom() {
        return this._uom;
    }

    /**
     * setter for the select
     *
     * @param value the new value
     */
    set uom(value) {
        this._uom = value;
        this.onChange(value);
    }

    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        if (value) {
            this._uom = value;
        } else {
            this._uom = '';
        }
    }
}
