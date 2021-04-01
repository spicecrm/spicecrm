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
import {NG_VALUE_ACCESSOR} from "@angular/forms";

const ngValueAccessor = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SystemInputBase64),
    multi: true
};

@Component({
    selector: 'system-input-base64',
    templateUrl: './src/systemcomponents/templates/systeminputbase64.html',
    providers: [ngValueAccessor]
})

export class SystemInputBase64 {

    @Input() private minHeight: number = 150;
    @Input() private maxHeight: number = 500;
    @Input() private disabled: boolean = false;

    private onChange: (value: string) => void;
    private onTouched: () => void;

    private _value: string = '';

    get value() {
        if(this._value && this._value != '') {
            try {
                return decodeURIComponent(window.atob(this._value));
            } catch (e) {
                try {
                    return window.atob(this._value);
                } catch (e) {
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    set value(val) {
        this._value = window.btoa(val);
        if (typeof this.onChange === 'function') {
            this.onChange(this._value);
        }
    }

    get textAreaStyle() {
        return {
            'min-height': this.minHeight + 'px',
            'max-height': this.maxHeight + 'px'
        };
    }

    /*
    * ControlValueAccessor Interface
    */
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /*
    * ControlValueAccessor Interface
    */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this._value = value;
    }
}
