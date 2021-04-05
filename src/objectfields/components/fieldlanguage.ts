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
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * Display the available system languages in a select list and handle setting the language field value.
 */
@Component({
    selector: 'field-enum',
    templateUrl: './src/objectfields/templates/fieldlanguage.html'
})
export class fieldLanguage extends fieldGeneric implements OnInit {
    /**
     * display value for the language
     */
    protected displayValue: string = '';
    /**
     * system language possible options
     */
    protected options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /**
     * get language options and subscribe to data changes
     */
    public ngOnInit() {
        super.ngOnInit();
        this.getOptions();
        this.subscribeToDataChanges();
    }

    /**
     * get language options
     */
    private getOptions() {
        this.options = this.language.getAvialableLanguages().map(language => ({
            value: language.language,
            display: language.text
        }));
        if (!!this.fieldconfig.canBeEmpty) {
            this.options.unshift({value: '', display: ''});
        }
    }

    /**
     * subscribe to model data change and set the value and the display value
     */
    private subscribeToDataChanges() {

        this.subscriptions.add(
            this.model.data$.subscribe(data => {

                if (!!data[this.fieldname] && this.value != data[this.fieldname]) {
                    this.value = data[this.fieldname];
                }
                if (this.displayValue != this.value) {
                    this.setDisplayValue();
                }
            })
        );
    }

    /**
     * set the display value
     */
    private setDisplayValue() {
        const lang = this.options.find(lang => lang.value == this.model.data[this.fieldname]);
        this.displayValue = lang?.display || '';
    }
}
