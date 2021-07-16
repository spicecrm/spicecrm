/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'language-label-modal',
    templateUrl: './src/workbench/templates/languagelabelmodal.html',
})
export class LanguageLabelModal {
    @Input() private label: any = {};
    @Output('label') public label$ = new EventEmitter();
    @Output('close') public close$ = new EventEmitter();

    private languages = [];
    public self;

    constructor(
        private utils: modelutilities,
        private language: language,
        private backend: backend,
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

    private validate() {
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

    private save() {
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

    private getcurrentLanguageTranslations(){
        let translations = this.translations;
        let currenttranslation = {default: '', short: '', long: ''};
        translations.some(translation => {
            if(translation.syslanguage == this.language.currentlanguage){
                currenttranslation.default = translation.translation_default;
                currenttranslation.short = translation.translation_short;
                currenttranslation.long = translation.translation_long;
                return true;
            }
        });
        return currenttranslation;
    }

    private cancelDialog() {
        this.label = {};
        this.label$.emit(null);
        this.close$.emit('cancel');
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancelDialog();
    }

    private addTranslation(language_name: string = null) {
        if (!language_name) {
            let langs = this.getMissingLanguages();
            language_name = langs[0];
        }

        this.label[this.label.scope + '_translations'].push({
            id: this.utils.generateGuid(),
            syslanguagelabel_id: this.label.id,
            syslanguage: language_name,
        });
    }

    private getMissingLanguages(scope: string = null): any[] {
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

    private getLangText(language) {
        return this.language.getLangText(language);
    }
}
