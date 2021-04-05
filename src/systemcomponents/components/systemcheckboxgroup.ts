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
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * @ignore
 */
declare var _;

/**
 * renders a checbox group
 */
@Component({
    selector: 'system-checkbox-group',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckboxGroup),
            multi: true
        }
    ]
})
export class SystemCheckboxGroup implements ControlValueAccessor, AfterViewInit {
    /**
     * emit value to children to set checked value
     */
    public valueEmitter = new EventEmitter<void>();
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (value: string[]) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;

    constructor(private cdRef: ChangeDetectorRef) {
    }

    private _value: string[] = [];

    /**
     * @return ng model value
     */
    get value(): string[] {
        return this._value;
    }

    /**
     * call ControlValueAccessor functions to update and emit changes
     * @param value
     */
    set value(value: string[]) {
        this.onChange(value);
        this.writeValue(value);
    }

    /**
     * write local value by ControlValueAccessor
     * @param value
     */
    public writeValue(value: string[]): void {
        if(value && !_.isEqual(value, this._value)) {
            this._value = value;
            this.cdRef.detectChanges();
            this.valueEmitter.emit();
        }
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = (val) => fn(val);
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * detach the change detection from the view
     */
    public ngAfterViewInit() {
        this.cdRef.detach();
    }

    /**
     * re attach the component to the change detection
     */
    public ngOnDestroy() {
        this.cdRef.reattach();
    }
}
