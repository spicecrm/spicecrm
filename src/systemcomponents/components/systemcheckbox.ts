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
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    ChangeDetectorRef,
    ViewChild,
    ElementRef, OnChanges, SimpleChanges, AfterViewInit
} from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var _;

/**
 * a standard checkbox component, compatible with ngModel!
 */
@Component({
    selector: 'system-checkbox',
    templateUrl: './src/systemcomponents/templates/systemcheckbox.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckbox),
            multi: true
        }
    ]
})
export class SystemCheckbox implements ControlValueAccessor, OnChanges, AfterViewInit {

    @ViewChild('inputCheckbox') public inputCheckbox: ElementRef;

    /**
     * set to true to render the checkbox without the NGContent. This is useful if you want to display the checkbox without any text and the adjacent elements are messing up the layout
     * ToDo: check if we can assess if ngcontent has been ppassed in ..
     */
    @Input() private hidelabel: boolean = false;

    /**
     * holds the checkbox indeterminate value
     */
    @Input() private indeterminate: boolean = false;

    /**
     * set to true if the model value should be returned as integer
     */
    @Input() private asinteger: boolean = false;


    /**
     * to disable the checkbox
     */
    @Input() private disabled = false;

    /**
     * an event emitter for the click
     */
    @Output('click') public click$ = new EventEmitter<boolean>();

    /**
     * an event emitter for the click
     */
    @Output('change') public change$ = new EventEmitter<MouseEvent>();

    /**
     * the internal uinique id for the element
     */
    private id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...

    /**
     * the internal held value for the model
     */
    private _model_value: any;

    /**
     * the value to set for the checkbox
     */
    private _value: any = "1"; // the value used for the "value" attribute of the checkbox itself

    get value() {
        return this._value;
    }

    @Input()
    set value(val: any) {
        this._value = val;
    }


    get model_value() {
        return this.asinteger ? this._model_value == 1 ? true: false : this._model_value;
    }

    set model_value(val) {
        let mval = this.asinteger ? val ? 1 : 0 : val
        if (mval != this._model_value) {
            this.onChange(mval);
        }

        this.writeValue(mval);
    }


    constructor(
        private language: language,
        private cdRef: ChangeDetectorRef
    ) {

    }

    /**
     * call to set the checkbox indeterminate value
     */
    public ngAfterViewInit() {
        this.setCheckboxIndeterminate();
    }

    /**
     * call to set the checkbox indeterminate value
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.indeterminate) {
            this.setCheckboxIndeterminate();
        }
    }

    /**
     * set the checkbox indeterminate value
     * @private
     */
    private setCheckboxIndeterminate() {
        if (!this.inputCheckbox) return;
        this.inputCheckbox.nativeElement.indeterminate = this.indeterminate;
    }

    private click(e: MouseEvent) {
        e.stopPropagation();

        if (this.disabled) return false;

        this.onTouched();

        this.click$.emit(this.value);
    }


    // ControlValueAccessor implementation:
    private onChange(val: string){};// => void;
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    private onTouched(){};// => void;
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(obj: any): void {
        this._model_value = obj;

        this.cdRef.detectChanges();
    }
}
