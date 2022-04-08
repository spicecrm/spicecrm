/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-country',
    templateUrl: '../templates/systeminputcountry.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputCountry),
            multi: true
        }
    ]
})
export class SystemInputCountry implements OnInit, ControlValueAccessor {

    /**
     * the options from the enum
     */
    public countries: any[] = [];

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the value
     */
    public _value: string;

    /**
     * set to true if the address inpout shoudl be strict according to the dropdown values
     */
    public strict: boolean = false;

    constructor(public metadata: metadata, public language: language, public configuration: configurationService) {
        let addressmode = this.configuration.getCapabilityConfig('spiceui').addressmode;
        if(addressmode == 'strict') this.strict = true;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (value != this._value) {
            this._value = value;
            this.onChange(value);
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
        this._value = value;
    }

    public ngOnInit(): void {
        if(this.strict) {
            this.getCountries();
        }
    }

    public getCountries() {
        let countries = this.configuration.getData('countries');
        this.countries = countries?.countries ? countries.countries : [];
        this.countries.sort((a, b) => this.language.getLabel(a.label).localeCompare(this.language.getLabel(b.label)));
    }

}
