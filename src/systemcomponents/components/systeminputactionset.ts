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
import {AfterViewInit, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * a generic input for an action that allows filtering by module and displays a select with custom and global items
 */
@Component({
    selector: "system-input-actionset",
    templateUrl: "./src/systemcomponents/templates/systeminputactionset.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputActionset),
            multi: true
        }
    ]
})
export class SystemInputActionset implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * hods the componentset
     */
    private _actionset: string;

    /**
     * the fieldsets available
     */
    private _actionsets: any[] = [];

    /**
     * the current module
     */
    private _module: string = '';

    constructor(
        private language: language,
        private metadata: metadata,
    ) {
        this._actionsets = this.metadata.getActionSets();
    }

    /**
     * a getter for the actionset itself
     */
    get actionset() {
        return this._actionset;
    }

    /**
     * a setter for the actionset - also trigers the onchange
     *
     * @param actionset the iod of the fieldset
     */
    set actionset(actionset) {
        this._actionset = actionset;
        this.onChange(actionset);
    }

    /**
     * sets the module from a selected fieldset
     */
    private detectModule() {
        // set the module if a fieldset is set
        if (this._actionset) {
            this._module = this.metadata.getActionSet(this._actionset).module;
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
        this._actionset = value;

        // determine the module from the fieldset
        this.detectModule();
    }

}
