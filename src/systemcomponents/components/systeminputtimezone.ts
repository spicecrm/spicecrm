/*
SpiceUI 2021.01.001

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

declare var moment: any;

/**
 * A generic input component that renders a select field with all the world timezones.
 */
@Component({
    selector: "system-input-timezone",
    templateUrl: "./src/systemcomponents/templates/systeminputtimezone.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputTimezone ),
            multi: true
        }
    ]
})
export class SystemInputTimezone implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;
    @Input() private id = '';

    // for the value accessor
    public propagateChange = (_) => { 1; };
    public propagateTouch = (_) => { 1; };

    /**
     * Holds the timezone
     */
    private _timezone: string;

    /**
     * all the timezones of the world (from moment.js)
     */
    private timezones: any[] = [];

    /**
     * The offsets of the timezones (from moment.js)
     */
    private offsetTimezones: number[] = [];

    constructor() {
        // Get the timezones from moment.js:
        this.timezones = moment.tz.names();
        // Strip strange timezone names:
        this.timezones = this.timezones.filter( ( timezone: string ) => {
            return timezone.match(/^((Africa|America|Antarctica|Arctic|Asia|Atlantic|Australia|Europe|Pacific)\/.+|UTC)$/);
        });
        // Get the timezone offsets:
        this.timezones.forEach( (timezone: string) => this.offsetTimezones.push( moment.tz( timezone ).format('Z') ) );
    }

    /**
     * a getter for the timezone itself
     */
    get timezone(): string {
        return this._timezone;
    }

    /**
     * a setter for the timezone - also triggers the propagateChange
     *
     * @param companycode the timezone
     */
    set timezone( value: string ) {
        this._timezone = value;
        this.propagateChange( value );
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange( fn: any ): void {
        this.propagateChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched( fn: any ): void {
        this.propagateTouch = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue( value: string ): void {
        this._timezone = value;
    }

}
