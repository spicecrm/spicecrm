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
 * @module ObjectFields
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-multiple-enum-dropdown',
    templateUrl: './src/objectfields/templates/fieldmultipleenumdropdown.html'
})
export class fieldMultipleEnumDropdown extends fieldGeneric implements OnInit, OnDestroy {
    private valueArray = [];
    private viewModeValueText = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);

    }

    public ngOnInit() {
        this.setSubscriptions();
    }

    /**
     * Detect Changes
     */
    private setSubscriptions() {
        this.subscriptions.add(
            // Detect changement of model data.
            this.model.data$.subscribe(
                () => {
                    this.createValueArray();
                    this.createViewModeValueText();
                }
            )
        );
        this.subscriptions.add(
            // Detect changement of the current language to change the selected options (in view mode).
            this.language.currentlanguage$.subscribe( () => {
                this.createViewModeValueText();
            })
        );
    }

    /**
     * Provide the possible options for the select field.
     */
    get listItems() {
        return this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
    }

    /**
     * Set the value field with the selected options delivered from systemmultipleselect.
     */
    private setFieldValue(valueArray) {
        this.value = valueArray.map(item => `^${item}^`).join(',');
        this.createValueArray();
        this.createViewModeValueText();
    }

    /**
     * Create the array of selected options, from the field "value" (type text).
     */
    private createValueArray() {
        this.valueArray = this.value ? this.value.replace(/\^/g, '').split(',') : [];
    }

    /**
     * Create the text variant of the selected options.
     */
    private createViewModeValueText() {
        let languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        this.viewModeValueText = this.valueArray.map( item => languageOptions[item]).join(', ');
    }

    /**
     * Display the options grouped? Default (undefined) is true, for backward compatibility reasons.
     */
    get grouped() {
        return ( this.fieldconfig.grouped === undefined || this.fieldconfig.grouped === true ) ? true : false;
    }

    /**
     * unsubscribe from various subscriptions on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

