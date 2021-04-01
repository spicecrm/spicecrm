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
    forwardRef,
    OnDestroy,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: "system-input-label",
    templateUrl: "./src/systemcomponents/templates/systeminputlabel.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputLabel),
            multi: true
        }
    ]
})
export class SystemInputLabel implements OnDestroy, ControlValueAccessor {
    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;
    private _time: any = {
        display: '',
        moment: null,
        offset: 0,
        valid: true
    };

    private label: string = '';

    // for the dropdown
    private _searchterm: string = '';
    private clickListener: any;
    private foundlabels: string[] = [];

    constructor(
        private language: language,
        private modal: modal,
        private modelutilities: modelutilities
    ) {
    }

    get isOpen() {
        return this._searchterm != '';
    }

    get searchterm() {
        return this._searchterm;
    }

    set searchterm(st) {
        this._searchterm = st;
        this.dosearch();
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private onBlur() {
        this._searchterm = '';
    }

    private dosearch() {
        if (this._searchterm) {
            this.foundlabels = this.language.searchLabel(this._searchterm, 50);
        } else {
            this.foundlabels = [];
        }
    }

    private selectLabel(label) {
        this.label = label;
        this._searchterm = '';
        this.onChange(label);
    }

    private clearField() {
        this.label = '';
        this.onChange('');
    }

    private keyup(_e) {
        switch (_e.key) {
            case 'Enter':
                this.label = this._searchterm;
                this.onChange(this.label);
                this._searchterm = '';
                break;
        }
    }

    private addLabel() {
        let label = {
            id: this.modelutilities.generateGuid(),
            name: '',
            scope: 'custom',
            custom_translations: [],
            global_translations: [],
        };
        label.custom_translations.push(
            {
                id: this.modelutilities.generateGuid(),
                syslanguagelabel_id: label.id,
                syslanguage: this.language.languagedata.languages.default,
            }
        );
        this.modal.openModal('LanguageLabelModal').subscribe(modal => {
            modal.instance.label = label;
            modal.instance.label$.subscribe(value => {
                if (value) {
                    this.label = value.name;
                    this.onChange(this.label);
                }
            });
        });
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
        this.label = value;
    }

}
