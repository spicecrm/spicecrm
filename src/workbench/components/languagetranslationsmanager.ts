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
 * @module WorkbenchModule
 */
import {Component,} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";

@Component({
    selector: 'language-translations-manager',
    templateUrl: './src/workbench/templates/languagetranslationsmanager.html',
})
export class LanguageTranslationsManager {

    public labels: any[] = [];
    public currentScope = 'global';
    public selectedLanguage = '';
    public isLoading = false;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
        private toast: toast,
    ) {
    }

    get scope() {
        return this.currentScope;
    }

    set scope(value) {
        this.currentScope = value;
        this.getTranslations();
    }

    get languages() {
        return this.language.getAvialableLanguages().filter(lang => lang.language != this.language.currentlanguage);
    }

    get selectedLanguageText() {
        return this.language.getLangText(this.language.currentlanguage);
    }

    public save(label) {
        let prop = this.scope == 'global' ? 'global_translations' : 'custom_translations';
        let body = {
            id: label.id,
            name: label.name,
            scope: this.scope,
            [prop]: [
                {
                    id: this.utils.generateGuid(),
                    syslanguagelabel_id: label.id,
                    syslanguage: this.selectedLanguage,
                    translation_default: label.translation_default,
                    translation_short: label.translation_short,
                    translation_long: label.translation_long
                }
            ]
        };

        this.backend.postRequest('syslanguages/labels', null, [body]).subscribe(
            (res) => {
                this.language.addLabel(label.name, label.translation_default, label.translation_short, label.translation_long);
                this.labels = this.labels.filter(thisLabel => thisLabel.id != label.id);
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            }
        );
    }

    private getLabelSpecificLength(label, length) {
        let defaultText: string = this.language.getLabel(label);
        let text: string = this.language.getLabel(label, '', length);
        return text != defaultText ? text: '';
    }

    private getTranslations() {
        this.labels = [];
        if (this.selectedLanguage.length == 0) {
            return;
        }
        this.isLoading = true;
        this.backend.getRequest(`syslanguage/${this.selectedLanguage}/${this.scope}/labels/untranslated`)
            .subscribe(
                (res) => {
                    this.labels = res;
                    this.isLoading = false;
                },
                err => this.isLoading = false);
    }

    private canSave(label) {
        return label.translation_default && label.translation_default.length > 0;
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
