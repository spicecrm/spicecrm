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

// from https://github.com/kolkov/angular-editor
import {
    Component, ElementRef,
    forwardRef,
    Input
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var moment: any;


/**
 * a generic component that renders an input field with a delay
 */
@Component({
    selector: "system-input-delayed",
    templateUrl: "./src/systemcomponents/templates/systeminputdelayed.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDelayed),
            multi: true
        }
    ]
})
export class SystemInputDelayed implements ControlValueAccessor {

    /**
     * @ignore
     *
     * for the vlaue accessor
     */
    private onChange: (value: string) => void;

    /**
     * @ignore
     *
     * for the vlaue accessor
     */
    private onTouched: () => void;

    /**
     * @ignore
     *
     * keeps the value internally
     */
    private _value: string;

    /**
     * @ignore
     *
     * the timeout function
     */
    private _modeltimeout: any;

    /**
     * the delay the model update is fired after the value has changed
     */
    @Input() private delay: number = 500;

    /**
     * @ignore
     *
     * funnel through the placeholder
     */
    @Input() private placeholder: string = '';

    /**
     * getter for the value
     */
    get value() {
        return this._value;
    }

    /**
     * the setter for the value
     *
     * @param newValue the new value received
     */
    set value(newValue) {
        this._value = newValue;
        if (this._modeltimeout) window.clearTimeout(this._modeltimeout);
        this._modeltimeout = window.setTimeout(() => this.onChange(this._value), this.delay);
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

}
