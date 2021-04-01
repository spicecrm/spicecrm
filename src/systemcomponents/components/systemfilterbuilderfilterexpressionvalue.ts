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
    AfterViewInit,
    Component, forwardRef, Input, OnChanges, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var moment: any;

@Component({
    selector: 'system-filter-builder-expression-value',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpressionvalue.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemFilterBuilderFilterExpressionValue),
            multi: true
        }
    ]
})
export class SystemFilterBuilderFilterExpressionValue implements ControlValueAccessor {

    /**
     * a reference to the value container
     */
    // @ViewChild("valueContainer", {read: ViewContainerRef, static: false}) private valueContainer: ViewContainerRef;

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the field
     */
    @Input() public field: string;


    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the module we are attaching this filter to
     */
    @Input() private valueType: string;

    /**
     * the value
     */
    private _value: any;

    constructor(
        public metadata: metadata,
    ) {

    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        switch (this.valueType) {
            case 'date':
                this.onChange(value.format('YYYY-MM-DD'));
                break;
            case 'multienum':
                this.onChange(value.join(','));
                break;
            default:
                this.onChange(value);
                break;
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
        switch (this.valueType) {
            case 'date':
                this._value = new moment(value);
                break;
            case 'multienum':
                this._value = value ? value.split(',') : [];
                break;
            default:
                this._value = value;
                break;
        }
    }

    get relatedmodule() {
        return this.metadata.getFieldDefs(this.module, this.field).module;
    }

}
