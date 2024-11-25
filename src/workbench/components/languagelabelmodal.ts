/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'language-label-modal',
    templateUrl: '../templates/languagelabelmodal.html',
})
export class LanguageLabelModal {
    @Input() public label: any = {};
    @Output('label') public label$ = new EventEmitter();
    @Output('close') public close$ = new EventEmitter();

    public languages = [];
    public self;

    constructor(
        public utils: modelutilities,
        public language: language,
        public backend: backend,
        public modal: modal,
        public configurationService: configurationService
    ) {
        this.languages = this.language.getAvialableLanguages(true);
    }

    get translations() {
        return this.label[this.label.scope + '_translations'] || [];
    }

    set translations(val) {
        this.label[this.label.scope + '_translations'] = val;
    }

    get name() {
        return this.label ? this.label.name : '';
    }

    set name(val) {
        val = val.toUpperCase().trim().replace('-', '_');
        this.label.name = val;
    }

    get scope() {
        return this.label ? this.label.scope : '';
    }

    set scope(val) {
        // copy translations to the corresponding relation
        this.label[val + '_translations'] = this.translations;
        // erase the current translations...
        this.translations = [];

        this.label.scope = val;
    }

    public validate() {
        // validation...
        if (!this.label.name) {
            return false;
        }
        if (/[^A-Z_0-9]/.test(this.label.name)) {
            return false;
        }
        for (let trans of this.translations) {
            if (!trans.translation_default) {
                // console.warn('default translation is missing!');
                return false;
            }
        }

        return true;
    }

    public save() {
        this.label.name = this.label.name.toUpperCase();

        let valid = this.validate();
        if (!valid) return false;

        this.backend.postRequest('configuration/syslanguages/labels', null, [this.label]).subscribe(
            (res) => {
                this.label$.emit(this.label);
                this.close$.emit('save');

                // add to language service
                let currenttranslation = this.getcurrentLanguageTranslations();
                this.language.addLabel(this.label.name, currenttranslation.default, currenttranslation.short, currenttranslation.long);

                // close the modal
                if (this.self) {
                    this.self.destroy();
                }
            }
        );
    }

    public getcurrentLanguageTranslations() {
        let translations = this.translations;
        let currenttranslation = {default: '', short: '', long: ''};
        translations.some(translation => {
            if (translation.syslanguage == this.language.currentlanguage) {
                currenttranslation.default = translation.translation_default;
                currenttranslation.short = translation.translation_short;
                currenttranslation.long = translation.translation_long;
                return true;
            }
        });
        return currenttranslation;
    }

    public cancelDialog() {
        this.label = {};
        this.label$.emit(null);
        this.close$.emit('cancel');
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancelDialog();
    }

    public addTranslation(language_name: string = null) {
        if (!language_name) {
            let langs = this.getMissingLanguages();
            language_name = langs[0];
        }

        // check if we have the label in the system language
        let sysTranslations = this.label[this.label.scope + '_translations'].find(l => l.syslanguage == this.language.getDefaultLanguage());
        if (this.configurationService.getCapabilityConfig('syslanguages').apikey && sysTranslations) {
            let labels = [];
            if (sysTranslations.translation_short) labels.push(sysTranslations.translation_short);
            if (sysTranslations.translation_default) labels.push(sysTranslations.translation_default);
            if (sysTranslations.translation_long) labels.push(sysTranslations.translation_long);

            if(labels.length > 0) {
                let awaitModal = this.modal.await('LBL_TRANSLATING');
                let defaultLanguage = this.language.getDefaultLanguage();
                this.backend.postRequest(`syslanguage/labels/translate/${defaultLanguage}/${language_name}`, {}, {labels: labels}).subscribe({
                    next: (res) => {
                        let newLabel: any = {
                            id: this.utils.generateGuid(),
                            syslanguagelabel_id: this.label.id,
                            syslanguage: language_name
                        }

                        let index = 0;
                        if (sysTranslations.translation_short) {
                            newLabel.translation_short = res[index];
                            index++;
                        }
                        if (sysTranslations.translation_default) {
                            newLabel.translation_default = res[index];
                            index++;
                        }
                        if (sysTranslations.translation_long) {
                            newLabel.translation_long = res[index];
                            index++;
                        }
                        this.label[this.label.scope + '_translations'].push(newLabel);
                        awaitModal.emit(true);
                    },
                    error: (e) => {
                        this.label[this.label.scope + '_translations'].push({
                            id: this.utils.generateGuid(),
                            syslanguagelabel_id: this.label.id,
                            syslanguage: language_name,
                        });
                        awaitModal.emit(true);
                    }
                })
            } else {
                this.label[this.label.scope + '_translations'].push({
                    id: this.utils.generateGuid(),
                    syslanguagelabel_id: this.label.id,
                    syslanguage: language_name,
                });
            }
        } else {
            this.label[this.label.scope + '_translations'].push({
                id: this.utils.generateGuid(),
                syslanguagelabel_id: this.label.id,
                syslanguage: language_name,
            });
        }
    }

    public getMissingLanguages(scope: string = null): any[] {
        if (!scope) {
            scope = this.scope;
        }

        let missing_langs = [];
        for (let lang of this.languages) {
            if (!this.translations.find((e) => {
                return e.syslanguage == lang.language
            })) {
                missing_langs.push(lang);
            }
        }
        return missing_langs;
    }

    public getLangText(language) {
        return this.language.getLangText(language);
    }
}
