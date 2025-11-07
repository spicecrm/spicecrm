import {Component} from '@angular/core';
import {language} from "../../services/language.service";

@Component({
    selector: 'global-field-translations-language-button',
    templateUrl: '../templates/globalfieldtranslationslanguagebutton.html',
    standalone: false
})
export class GlobalFieldTranslationsLanguageButton {
    /**
     * holds the languages available for translation
     */
    public languages: {code: string; name: string;}[] = [];

    constructor(public language: language) {
        this.initialize();
    }

    /**
     * set the hasTranslatedFields flag
     * @private
     */
    private initialize() {
        this.languages = this.language.getAvialableLanguages()
            .map(language => ({
                code: language.language,
                name: this.language.getLabel('LANG_' + language.language.toUpperCase())
            }));
    }

    /**+
     * set the current translation language in the model
     * @param code
     */
    public selectLanguage(code: string) {
        this.language.currentFieldTranslationLanguage.set(code);
    }
}