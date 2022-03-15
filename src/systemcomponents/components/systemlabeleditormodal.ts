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
    templateUrl: "../templates/systemlabeleditormodal.html",
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
    public languagesNames = {};
    /**
     * holds the untranslated languages
     * @private
     */
    public untranslatedLanguages = [];
    /**
     * true while retrieving the label data
     * @private
     */
    public isLoading: boolean = false;
    /**
     * reference for this component to enable destroy
     * @private
     */
    public self;

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public utils: modelutilities,
        public toast: toast,
        public modal: modal
    ) {
    }

    public _labelData = null;
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
    public trackByFn(index, item) {
        return index;
    }

    /**
     * retrieve label data
     * @private
     */
    public retrieveLabelData() {

        this.isLoading = true;

        this.backend.getRequest('configuration/syslanguages/labels/' + this.labelData.name).subscribe(
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
    public save() {
        this.close();
        this.backend.postRequest('configuration/syslanguages/labels', null, [this.labelData]).subscribe(
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
    public setUntranslatedLanguages() {
        this.untranslatedLanguages = !this.translations ? this.availableLanguages : this.availableLanguages
            .filter(lang => !this.translations.some(t => t.syslanguage == lang.language));
    }

    /**
     * load the available languages
     * @private
     */
    public loadAvailableLanguages() {
        this.availableLanguages = this.language.getAvialableLanguages();
        this.availableLanguages.forEach(lang => this.languagesNames[lang.language] = lang.text);
    }

    /**
     * destroy the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }
}
