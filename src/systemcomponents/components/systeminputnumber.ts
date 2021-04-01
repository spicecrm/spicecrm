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
import {userpreferences} from '../../services/userpreferences.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-number',
    templateUrl: './src/systemcomponents/templates/systeminputnumber.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputNumber),
            multi: true
        }
    ]
})
export class SystemInputNumber implements ControlValueAccessor {

    @Input() private max: number;
    @Input() private min: number;
    @Input() private precision: number;
    @Input() private onlyField = false; // Display only the html input field, not the surrounding html
    @Input() private placeholder: string; // HTML attribute
    @Input() private disabled = false; // HTML attribute
    @Input() private size: number; // HTML attribute

    private textValue: string = '';
    private lastTextValue: string = ''; // The previous textValue, for comparison.

    constructor(public userpreferences: userpreferences) {
    }

    // ControlValueAccessor Interface: >>

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.textValue = value;
        if (this.textValue) this.getValSanitized(this.textValue);
        this.lastTextValue = this.textValue;
    }

    private onChange(val: string): void { 1; }

    private onTouched(): void { 1; }

    // ControlValueAccessor Interface <<

    /**
     * Actions to do when the HTML input field changed.
     * @param event The DOM event
     */
    private fieldChanged(event) {
        this.textValue = typeof(this.textValue) != 'number' ? this.getValSanitized(this.textValue) : this.textValue;
        // Only submit the (new) value if the sanitized value has actually changed:
        if ( this.textValue !== this.lastTextValue ) {
            this.onChange( this.textValue );
            this.lastTextValue = this.textValue;
        } else event.stopPropagation(); // The value of the HTML input field changed, but the real value (sanitized) stayed the same. So no propagation of the change event.
    }

    /**
     * Takes a string that should be a number, removes group seperators, cuts to specific decimal places, limit it to min and max - and returns it as string (in case it is a valid number).
     * @param textValue The text value to sanitize.
     */
    private getValSanitized(textValue: string): string {
        let pref = this.userpreferences.toUse;
        let defSigDigits = this.precision === undefined ? pref.default_currency_significant_digits : this.precision;
        let numberValue: any = this.textValue.split(pref.num_grp_sep).join('');
        numberValue = numberValue.split(pref.dec_sep).join('.');
        numberValue = isNaN(parseFloat(numberValue)) ? undefined : (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        numberValue = numberValue && numberValue > this.max ? this.max : numberValue;
        numberValue = numberValue && numberValue < this.min ? this.min : numberValue;
        return this.getValAsText(numberValue);
    }

    private getValAsText(numValue) {
        if (numValue === undefined) {
            return '';
        }
        let val = parseFloat(numValue);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val, this.precision);
    }

}
