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
 * @module SpiceTextsModule
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subject} from "rxjs";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

declare var _;

@Component({
    templateUrl: './src/include/spicetexts/templates/spicetextsaddmodal.html',
    providers: [model, view]
})

export class SpiceTextsAddModal implements OnInit {

    public spiceTexts: any[] = [];
    public sysTextIds: any[] = [];
    public parent: any = {};
    public response: any = new Subject<any>();
    public self: any = {};
    public saveTriggered: boolean = false;
    private loading: string = '';

    constructor(private model: model,
                private configurationService: configurationService,
                private view: view,
                private backend: backend,
                private language: language) {
        this.model.module = 'SpiceTexts';
    }

    get textId() {
        return this.model.getField('text_id');
    }

    set textId(val) {
        this.model.setField('text_id', val);
        this.model.resetFieldMessages('text_id', 'error', 'validation');
        this.loading = 'text_language';
        window.setTimeout(() => this.loading = '', 500);
    }

    get textLanguage() {
        return this.model.getField('text_language');
    }

    set textLanguage(val) {
        this.model.setField('text_language', val);
        this.model.resetFieldMessages('text_language', 'error', 'validation');
        this.loading = 'text_id';
        window.setTimeout(() => this.loading = '', 500);
    }

    get availableSysLanguages() {
        return this.language.getAvialableLanguages().filter(lang => {
            let groupedTexts = _.groupBy(this.spiceTexts, 'text_id');
            let found = 0;
            for (let prop in groupedTexts) {
                if (groupedTexts.hasOwnProperty(prop)) {
                    let translated = groupedTexts[prop].find(txt => txt.text_language == lang.language);
                    found += translated ? 1 : 0;
                }
            }
            let currentTextTranslated = this.spiceTexts
                .find(txt => txt.text_id == this.textId && txt.text_language == lang.language);
            return (found < this.sysTextIds.length) && !currentTextTranslated;
        });
    }

    get availableSysTexts() {
        return this.sysTextIds.filter(sysText => {
            let found = this.spiceTexts.filter(txt => txt.text_id == sysText.text_id);
            let currentTextTranslated = this.spiceTexts
                .find(txt => txt.text_id == sysText.text_id && txt.text_language == this.textLanguage);
            return (found.length < this.language.getAvialableLanguages().length) && !currentTextTranslated;
        });
    }

    get isDisabledText() {
        return (!this.availableSysTexts || this.availableSysTexts.length == 0) || this.loading == 'text_id';
    }

    get isDisabledLang() {
        return (!this.availableSysLanguages || this.availableSysLanguages.length == 0) || this.loading == 'text_language';
    }

    public ngOnInit() {
        this.initializeModel();
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private getFieldStyle(field) {
        return this.model.getFieldMessages(field, 'error') ? 'slds-has-error' : '';
    }

    private initializeModel() {
        this.model.initialize();
        this.model.data.parent_id = this.parent.id;
        this.model.data.parent_type = this.parent.module;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private isLoading(field) {
        return this.loading == field;
    }

    private save() {
        this.saveTriggered = true;
        if (!this.model.validate()) {
            return this.saveTriggered = false;
        }
        let nameValue = this.model.getField('description').slice(0, 100);
        this.model.setField('name', nameValue);

        this.model.save(true).subscribe(
            data => {
                this.response.next(data);
                this.response.complete();
                this.self.destroy();
            },
            err => {
                this.cancel();
            });
        this.saveTriggered = false;
    }

    private cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }
}
