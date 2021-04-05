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
    Component, forwardRef, Input, OnDestroy, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var _: any;

@Component({
    selector: 'system-filter-builder',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilder.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemFilterBuilder),
            multi: true
        }
    ]
})
export class SystemFilterBuilder implements ControlValueAccessor {

    /**
     * the module for the filter
     */
    @Input() private module: string;

    /**
     * for the cvalue accessor
     */
    private onChange: (value: any) => void;

    /**
     * for the cvalue accessor
     */
    private onTouched: () => void;

    private _conditions = {
        logicaloperator: 'and',
        groupscope: 'all',
        conditions: []
    };

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
        if (value && !_.isEmpty(value)) {
            let conditions = {
                logicaloperator: value.logicaloperator,
                groupscope: value.groupscope,
                conditions: [...value.conditions],
            }
            this._conditions = conditions;
        }
    }

    private expressionChanged() {
        let newFilterGroupCondition = [];
        for (let filterGroupCondition of this._conditions.conditions) {
            if (filterGroupCondition.deleted !== true) {
                newFilterGroupCondition.push(filterGroupCondition);
            }
        }
        this._conditions.conditions = newFilterGroupCondition;

        if (!_.isEmpty(this._conditions.conditions)) {
            this.onChange({...this._conditions});
        } else {
            this.onChange(null);
        }
    }

}
