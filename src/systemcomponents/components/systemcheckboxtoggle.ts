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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * renders a toggle checkbox as lightning design system style and handle the value with two way binding
 */
@Component({
    selector: 'system-checkbox-toggle',
    templateUrl: './src/systemcomponents/templates/systemcheckboxtoggle.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckboxToggle),
            multi: true
        }
    ]
})
export class SystemCheckboxToggle implements ControlValueAccessor {
    /**
     * holds the checkbox label
     */
    @Input() private label = '';
    /**
     * holds the disabled boolean for the checkbox
     */
    @Input() private disabled = false;
    /**
     * holds the local value
     */
    private localValue: boolean;
    /**
     * holds the onChange function for NG_VALUE_ACCESSOR service
     * @private
     */
    private onChange: (val: string) => void;
    /**
     * holds the onTouched function for NG_VALUE_ACCESSOR service
     * @private
     */
    private onTouched: (val: string) => void;

    constructor(
        private cdRef: ChangeDetectorRef) {
    }

    /**
     * register the onChange function for NG_VALUE_ACCESSOR service
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * set the local value by NG_VALUE_ACCESSOR service
     * @param value
     */
    public writeValue(value: boolean): void {
        this.localValue = value;
        this.cdRef.detectChanges();
    }
}
