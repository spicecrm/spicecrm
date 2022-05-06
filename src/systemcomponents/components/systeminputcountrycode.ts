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
    selector: 'system-input-country-code',
    templateUrl: '../templates/systeminputcountrycode.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputCountryCode),
            multi: true
        }
    ]
})
export class SystemInputCountryCode implements OnInit, ControlValueAccessor {

    /**
     * the options from the enum
     */
    public countrycodes: any[] = [];

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

    constructor(
        public metadata: metadata,
        public language: language,
        public configuration: configurationService
    ) {
        let addressmode = this.configuration.data.backendextensions.spiceui.config.format;
        if (addressmode == 'strict') this.strict = true;
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
        if (this.strict) {
            this.getCountries();
        }
    }

    public getCountries() {
        this.countrycodes = [];
        let countries = this.configuration.getData('countries');
        for (let country of countries.countries) {
            if (!country.e164 || this.countrycodes.indexOf(country.e164) >= 0) continue;

            this.countrycodes.push(country.e164);
        }
        this.countrycodes.sort();
    }

}
