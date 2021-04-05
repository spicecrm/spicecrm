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
import {Component, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modelutilities} from "../../services/modelutilities.service";
import {metadata} from "../../services/metadata.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: "system-label-editor-modal",
    templateUrl: "./src/systemcomponents/templates/systemlabeleditormodal.html",
})
export class SystemLabelEditorModal implements OnInit {
    /**
     * holds the available languages
     */
    public availableLanguages = [];
    /**
     * holds the current translation scope
     */
    public currentScope = 'global';
    /**
     * holds the label translation scopes
     */
    public readonly scopes = ['global', 'custom'];
    /**
     * holds the languages names
     * @private
     */
    private languagesNames = {};
    /**
     * holds the untranslated languages
     * @private
     */
    private untranslatedLanguages = [];
    /**
     * true while retrieving the label data
     * @private
     */
    private isLoading: boolean = false;
    /**
     * reference for this component to enable destroy
     * @private
     */
    private self;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
        private toast: toast,
        private modal: modal
    ) {
    }

    private _labelData = null;
    /**
     * @return label data
     */
    get labelData(): any {
        return this._labelData;
    }

    /**
     * set the label data
     * @param val
     */
    set labelData(val: any) {
        this._labelData = val;
        if (!val || val[this.currentScope + '_translations'].length == 0) return;

        // if no translation is found for the current translation scope, find the right one...
        for (let scope of this.scopes) {
            if (val[scope + '_translations'].length > 0) {
                this.currentScope = scope;
                break;
            }
        }
        val[this.currentScope + '_translations'].sort((a, b) => {
                if (a.syslanguage == this.language.languagedata.languages.default || a.syslanguage < b.syslanguage) return -1;
                else if (a.syslanguage > b.syslanguage) return 1;
            }
        );
    }

    /**
     * @return label translations
     */
    get translations(): any {
        return this.labelData[`${this.currentScope}_translations`];
    }


    /**
     * add new translation to label
     * @param languageCode
     */
    public addTranslation(languageCode?: string) {

        if (!this.labelData[this.currentScope + '_translations']) {
            this.labelData[this.currentScope + '_translations'] = [];
        }

        if (!languageCode) {
            languageCode = this.untranslatedLanguages[0];
        }

        this.labelData[this.currentScope + '_translations'].push({
            id: this.utils.generateGuid(),
            syslanguagelabel_id: this.labelData.id,
            syslanguage: languageCode,
        });

        this.setUntranslatedLanguages();
    }

    /**
     * call to load available languages and set the missing languages
     */
    public ngOnInit() {
        this.loadAvailableLanguages();
        this.retrieveLabelData();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return index;
    }

    /**
     * retrieve label data
     * @private
     */
    private retrieveLabelData() {

        this.isLoading = true;

        this.backend.getRequest('syslanguages/labels/' + this.labelData.name).subscribe(
            (res) => {
                this.isLoading = false;
                if (res) {
                    this.labelData = res;
                } else {
                    // prompt the user to set the new scope
                    this.modal.openModal('SystemLabelEditorGlobalCustomModal', false).subscribe(modalRef => {
                        modalRef.instance.labelscope.subscribe(scope => {
                            this.currentScope = scope;
                            this.labelData = {
                                id: this.utils.generateGuid(),
                                name: this.labelData.name,
                                scope: this.currentScope,
                                global_translations: [],
                                custom_translations: []
                            };
                            this.addTranslation(this.language.currentlanguage);
                        });
                    });

                }
                this.setUntranslatedLanguages();
            },
            () => this.isLoading = false
        );
    }

    /**
     * save label changes to database
     */
    private save() {
        this.close();
        this.backend.postRequest('syslanguages/labels', null, [this.labelData]).subscribe(
            () => {
                let currentTranslation = this.translations.find(translation => translation.syslanguage == this.language.currentlanguage);
                this.language.addLabel(this.labelData.name, currentTranslation.translation_default, currentTranslation.translation_short, currentTranslation.translation_long);
                this.language.currentlanguage$.emit(this.language.currentlanguage);
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            }
        );
    }

    /**
     * set missing languages
     * @private
     */
    private setUntranslatedLanguages() {
        this.untranslatedLanguages = !this.translations ? this.availableLanguages : this.availableLanguages
            .filter(lang => !this.translations.some(t => t.syslanguage == lang.language));
    }

    /**
     * load the available languages
     * @private
     */
    private loadAvailableLanguages() {
        this.availableLanguages = this.language.getAvialableLanguages();
        this.availableLanguages.forEach(lang => this.languagesNames[lang.language] = lang.text);
    }

    /**
     * destroy the modal
     * @private
     */
    private close() {
        this.self.destroy();
    }
}
