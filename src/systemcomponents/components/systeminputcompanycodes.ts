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
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-companycodes",
    templateUrl: "./src/systemcomponents/templates/systeminputcompanycodes.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputCompanycodes),
            multi: true
        }
    ]
})
export class SystemInputCompanycodes implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * holds the companycoded
     */
    private _companycode: string;

    /**
     * the available companycodes
     */
    private _companycodes: any[] = [];

    constructor(
        private language: language,
        private configuration: configurationService
    ) {
        this._companycodes = this.configuration.getData('companycodes');
        if(typeof this._companycodes === 'object') {
            this._companycodes.sort((a, b) => a.name > b.name ? -1 : 1);
        }
    }

    /**
     * a getter for the companycode itself
     */
    get companycode() {
        return this._companycode;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param companycode the id of the companycode
     */
    set companycode(companycode) {
        this._companycode = companycode;
        if (this.onChange) {
            this.onChange(companycode);
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
        this._companycode = value;
    }

}
