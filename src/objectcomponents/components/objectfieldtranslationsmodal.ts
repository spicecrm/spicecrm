import {Component, ComponentRef, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {ModalComponentI, ModuleFieldTranslationI} from "../interfaces/objectcomponents.interfaces";
import {language} from "../../services/language.service";

@Component({
    selector: 'object-field-translations-modal',
    templateUrl: '../templates/objectfieldtranslationsmodal.html',
    standalone: false
})
export class ObjectFieldTranslationsModal implements ModalComponentI {
    /**
     * if true, enable editing. Passed by the parent component
     */
    public isEditMode: boolean = false;
    /**
     * holds the original text passed by the parent component
     */
    public originalText: string;
    /**
     * holds the translation array
     */
    public translations: WritableSignal<ModuleFieldTranslationI[]> = signal([]);
    /**
     * holds the translation language to be added on action
     */
    public translationLanguageToAdd: ModelSignal<string> = model();
    /**
     * holds the available languages
     */
    public availableLanguages: WritableSignal<{ code: string, name: string }[]> = signal([]);
    /**
     * reference to self
     */
    public self: ComponentRef<this>;

    constructor(public language: language) {
        this.loadAvailableLanguages();
    }

    /**
     * set translation array and filter out the translated languages
     * @param val
     */
    public setTranslations(val: ModuleFieldTranslationI[]) {

        this.translations.set(val);

        this.availableLanguages.set(
            this.availableLanguages().filter(language => !this.translations().some(t => t.translation_language == language.code))
        );

        if (this.availableLanguages().length == 1) {
            this.translationLanguageToAdd.set(this.availableLanguages()[0].code);
        } else {
            this.translationLanguageToAdd.set(undefined);
        }
    }

    /**
     * loads the available languages from the language service
     */
    public loadAvailableLanguages() {
        this.availableLanguages.set(
            this.language.getAvialableLanguages()
                .filter(l => l.language != this.language.currentlanguage)
                .map(language => ({
                    code: language.language,
                    name: this.language.getLabel('LANG_' + language.language.toUpperCase())
                }))
        );
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * add translation to the translation object
     */
    public addTranslation() {

        this.setTranslations([
                ...this.translations(),
                {
                    translation_language: this.translationLanguageToAdd(),
                    translation_text: ''
                }
            ]
        );
    }
}