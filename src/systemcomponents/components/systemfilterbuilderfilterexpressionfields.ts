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
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-filter-builder-expression-fields',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpressionfields.html',
    providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemFilterBuilderFilterExpressionFields),
        multi: true
    }
]
})
export class SystemFilterBuilderFilterExpressionFields implements OnInit, ControlValueAccessor {

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    public fields: any[] = [];

    private _field: string;


    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
    ) {

    }

    get field() {
        return this._field;
    }

    set field(field) {
        if (field != this._field) {
            this._field = field;
            this.onChange(field);
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
        this._field = value;
    }

    private getFieldDisplayOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.module, this.field);
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        return retArray.filter(item => item.value.length > 0);
    }

    /**
     * load the fields and sort them
     */
    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {
            // no links
            if(fields[field].type == 'link') continue;

            // no relate fields if no module is set or the relate is non db
            if(fields[field].type == 'relate') {
                if(!fields[field].module) continue;
                if(fields[field].id_name && fields[fields[field].id_name] && fields[fields[field].id_name].source == 'non-db') continue;
            }

            // no id fields
            if(fields[field].type == 'id') continue;

            // no non-db fields
            if(fields[field].source == 'non-db' && fields[field].type != 'relate') continue;

            this.fields.push(fields[field]);
        }

        // sort the fields
        this.fields.sort((a, b) => this.language.getFieldDisplayName(this.module, a.name).toLowerCase() > this.language.getFieldDisplayName(this.module, b.name).toLowerCase() ? 1 : -1);
    }

}
