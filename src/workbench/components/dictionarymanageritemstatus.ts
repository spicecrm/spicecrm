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
 * @module Workbench
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * toggleable bulb icon
 */
@Component({
    selector: 'dictionary-manager-item-status',
    templateUrl: './src/workbench/templates/dictionarymanageritemstatus.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DictionaryManagerItemStatus),
            multi: true
        }
    ]
})
export class DictionaryManagerItemStatus implements ControlValueAccessor {

    /**
     * allows this to be disabled
     * useful when the status shoudl be displayed but we do not want it ot be changeable since it is a referenced item
     *
     * @private
     */
    @Input() private disabled: boolean = false;

    /**
     * internal variable if checked
     */
    private status: 'i' | 'd' | 'a';

    /**
     * for the control accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;


    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }


    /**
     * returns a status color
     *
     * @param status
     */
    public getStatusColor() {
        switch (this.status) {
            case 'a':
                return 'slds-icon-text-success';
            case 'i':
                return 'slds-icon-text-light';
            default:
                return 'slds-icon-text-warning';
        }
    }


    /**
     * write the initial value
     *
     * @param value
     */
    public writeValue(value: 'i' | 'd' | 'a'): void {
        this.status = value;
    }

    /**
     * toggle the value on click if the component is not disabled
     *
     * @param $e
     * @private
     */
    private toggleValue($e: MouseEvent) {
        if(!this.disabled) {
            $e.stopPropagation();
            this.status === 'a' ? this.status = 'i' : this.status = 'a';
            this.onChange(this.status);
        }
    }
}
