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

        this.backend.postRequest('configuration/syslanguages/labels', null, [body]).subscribe(
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
        this.backend.getRequest(`configuration/syslanguage/${this.selectedLanguage}/${this.scope}/labels/untranslated`)
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
