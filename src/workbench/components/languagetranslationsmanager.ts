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
    templateUrl: '../templates/languagetranslationsmanager.html',
})
export class LanguageTranslationsManager {

    public labels: any[] = [];
    public currentScope = 'global';
    public selectedLanguage = '';
    public isLoading = false;

    /**
     * boolean value that indicates if we have a gioogle API key for the language service set
     */
    public cantranslate: boolean = false;

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public utils: modelutilities,
        public toast: toast,
    ) {
        this.backend.getRequest('syslanguage/labels/translate/cantranslate').subscribe({
            next: (res) => {
                this.cantranslate = res.cantranslate;
            }
        })
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

    /**
     * treanslates with a backend call to the Google API
     *
     * @param label
     */
    public translate(label){

        // build the array with the labels
        let elements = ['default']
        let labels = [this.language.getLabel(label.name)];
        let short = this.getLabelSpecificLength(label.name, 'short');
        if(short) {
            labels.push(short);
            elements.push('short');
        }
        let long = this.getLabelSpecificLength(label.name, 'long');
        if(long) {
            labels.push(long);
            elements.push('long');
        }

        // build from and to
        let from = this.language.currentlanguage.substr(0, 2);
        let to = this.selectedLanguage.substr(0, 2);

        // translate
        this.backend.postRequest(`syslanguage/labels/translate/${from}/${to}`, {}, {labels: labels}).subscribe({
            next: (res) => {
                if(res.data.translations){
                    res.data.translations.forEach((value, index) => {
                        label['translation_'+elements[index]] = value.translatedText;
                    });
                }
            }
        })
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

        this.backend.postRequest('configuration/syslanguages/labels', null, [body]).subscribe(
            (res) => {
                this.language.addLabel(label.name, label.translation_default, label.translation_short, label.translation_long);
                this.labels = this.labels.filter(thisLabel => thisLabel.id != label.id);
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            }
        );
    }

    public getLabelSpecificLength(label, length) {
        let defaultText: string = this.language.getLabel(label);
        let text: string = this.language.getLabel(label, '', length);
        return text != defaultText ? text: '';
    }

    public getTranslations() {
        this.labels = [];
        if (this.selectedLanguage.length == 0) {
            return;
        }
        this.isLoading = true;
        this.backend.getRequest(`configuration/syslanguage/${this.selectedLanguage}/${this.scope}/labels/untranslated`)
            .subscribe(
                (res) => {
                    this.labels = res;
                    this.isLoading = false;
                },
                err => this.isLoading = false);
    }

    public canSave(label) {
        return label.translation_default && label.translation_default.length > 0;
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
