import {Component, ComponentRef, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {
    ModalComponentI, ModuleFieldTranslationI,
    ModuleFieldTranslationsObjectI
} from "../interfaces/objectcomponents.interfaces";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'object-field-translations-modal',
    templateUrl: '../templates/objectfieldtranslationsmodal.html',
    standalone: false
})
export class ObjectFieldTranslationsModal implements ModalComponentI {
    /**
     * if true, display the richtext editor
     */
    public asRichtext: boolean = false;
    /**
     * if true, enable editing. Passed by the parent component
     */
    public isEditMode: boolean = false;
    /**
     * holds the original text passed by the parent component
     */
    public originalText: string;
    /**
     * holds the translation object to emit the changes to any signal effect subscriber
     */
    public translations: WritableSignal<ModuleFieldTranslationsObjectI> = signal(undefined);
    /**
     * holds the translations as an array to keep the sequence when adding new translations
     */
    public translationsArray: WritableSignal<ModuleFieldTranslationI[]> = signal([]);
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
    /**
     * is translating flag
     */
    public isTranslating: WritableSignal<string> = signal(undefined);

    constructor(public language: language, private backend: backend) {
        this.loadAvailableLanguages();
    }

    /**
     * set translation array and filter out the translated languages
     * @param val
     */
    public setTranslationsArray(val: ModuleFieldTranslationI[]) {

        this.translationsArray.set(val);

        this.availableLanguages.set(
            this.availableLanguages().filter(language => !val.some(t => t.translation_language == language.code))
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
        const newTranslation = {
            translation_language: this.translationLanguageToAdd(),
            translation_text: ''
        };

        this.setTranslationsArray([
            ...this.translationsArray(), newTranslation
        ]);

        this.emitChange();

        this.translate(newTranslation);
    }

    /**
     * set the translation signal object to emit the change to any effect subscriber
     */
    public emitChange() {
        this.translations.set(window._.object(
            this.translationsArray().map(t => t.translation_language),
            this.translationsArray()
        ));
    }

    /**
     * translate
     * @param translation
     */
    public translate(translation: ModuleFieldTranslationI) {

        this.isTranslating.set(translation.translation_language);

        this.backend.postRequest(`syslanguage/labels/translate/${this.language.currentlanguage}/${translation.translation_language}`, {}, {labels: [this.originalText]}).subscribe({
            next: (res) => {
                translation.translation_text = res[0];
                this.emitChange();
                this.isTranslating.set(undefined);
            },
            error: () => {
                this.isTranslating.set(undefined);
            }
        });
    }
}