/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/systemcomponents/templates/systeminputcountry.html',
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
    private countries: any[] = [];

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the value
     */
    private _value: string;

    /**
     * set to true if the address inpout shoudl be strict according to the dropdown values
     */
    private strict: boolean = false;

    constructor(private metadata: metadata, private language: language, private configuration: configurationService) {
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
