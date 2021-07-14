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
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {InputRadioOptionI} from "../interfaces/systemcomponents.interfaces";

/** @ignore */
declare var _;

/**
 * radio button group with the Lightning Design
 */
@Component({
    selector: 'system-input-radio-button-group',
    templateUrl: './src/systemcomponents/templates/systeminputradiobuttongroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRadioButtonGroup),
            multi: true
        }
    ]
})
export class SystemInputRadioButtonGroup implements ControlValueAccessor, AfterViewInit {

    /**
     * the value to be set
     */
    @Input() protected inputOptions: InputRadioOptionI[] = [];
    /**
     * the value to be set
     */
    @Input() protected readonly disabled: boolean = false;
    /**
     * the value to be set
     */
    protected groupName: string;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (value: string) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;

    /**
     * set group name for dom
     */
    constructor(private cdRef: ChangeDetectorRef) {
        this.groupName = _.uniqueId('group-name-');
    }

    /**
     * internal value checked
     */
    private _modelValue: string;

    /**
     * @return ng model value
     */
    get modelValue(): string {
        return this._modelValue;
    }

    /**
     * call ControlValueAccessor functions to update and emit changes
     * @param value
     */
    set modelValue(value: string) {
        this.onChange(value);
        this.writeValue(value);
    }

    public ngAfterViewInit(): void {
        this.cdRef.detach();
    }

    /**
     * call set items initial values
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.inputOptions) {
            this.setItemsInitialValues();
        }
        this.cdRef.detectChanges();
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * write value by ControlValueAccessor
     * @param value
     */
    public writeValue(value: string) {
        this._modelValue = value;
        this.cdRef.detectChanges();
    }

    /**
     * set items initial value
     */
    private setItemsInitialValues() {

        this.inputOptions.forEach(inputOption => {

            if (!inputOption.id) {
                inputOption.id = _.uniqueId('input-id-');
            }

            // set title from label if the title is undefined
            if (!!inputOption.label && !inputOption.title) {
                inputOption.title = inputOption.label;
            }
        });
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return item.id;
    }
}
