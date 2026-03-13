import {Component, effect, inject, Injector, input, Input, OnInit} from '@angular/core';
import {ObjectFieldTranslationsModal} from "../../objectcomponents/components/objectfieldtranslationsmodal";
import {
    ModuleFieldTranslationsObjectI
} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {modal} from "../../services/modal.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'field-translatable-text',
    templateUrl: '../templates/fieldtranslatabletext.html',
    standalone: false
})
export class FieldTranslatableText implements OnInit {
    /**+
     * reference to the injector api
     * @private
     */
    private injector: Injector = inject(Injector);
    /**
     * holds the text field name
     */
    public textFieldName: string;
    /**
     * holds the text field name
     */
    public textFieldConfig: {fieldtype: string, hidelabel: boolean; hasTranslationField: boolean};
    /**
     * the field name passed by the field container
     */
    @Input() public fieldname: string = '';
    /**
     * the field config passed by the field container
     */
    @Input() public fieldconfig: any = {};
    /**
     * additonal classes top be added when the field is displayed
     */
    @Input() public fielddisplayclass: string = '';
    /**
     * if true, use the field type passed directly to the component
     */
    public useOriginalFieldType = input<boolean>(true);

    constructor(private modal: modal,
                private model: model,
                private metadata: metadata,
                private language: language) {
    }

    public ngOnInit() {
        this.initializeTextFieldConfig();
    }

    /**
     * @return string the value in the current language or the original text
     */
    public getValue(editMode: boolean): string {
        if (!editMode && this.language.currentFieldTranslationLanguage()) {
            return this.getTranslatedValue() ?? this.model.getField(this.textFieldName);
        } else {
            return this.model.getField(this.textFieldName);
        }
    }

    /**
     * @return string the value in the current language or undefined
     */
    public getTranslatedValue(): string {
        if (!this.language.currentFieldTranslationLanguage()) {
            return undefined;
        }

        return this.model.getField(this.fieldname)[this.language.currentFieldTranslationLanguage()]?.translation_text;
    }

    /**
     * initialize the text field config
     * @private
     */
    private initializeTextFieldConfig() {
        this.textFieldConfig = {...this.fieldconfig};
        this.textFieldName = this.fieldname.replace('_translations', '');
        if (this.useOriginalFieldType()) {
            this.textFieldConfig.fieldtype = this.metadata.getFieldType(this.model.module, this.textFieldName);
        }
        this.textFieldConfig.hasTranslationField = true;

    }

    /**
     * open the translation modal
     */
    public openTranslationsModal(editMode: boolean, fieldType?: 'html' | 'text' | 'richtext'): void {

        this.modal.openStaticModal(ObjectFieldTranslationsModal, true, this.injector).subscribe(ref => {

            ref.instance.isEditMode = editMode;
            ref.instance.originalText.set(this.model.getField(this.textFieldName));
            ref.instance.fieldType = fieldType ?? 'text';
            if (!this.useOriginalFieldType() && ['html', 'richtext'].includes(this.textFieldConfig.fieldtype)) {
                ref.instance.fieldType = this.textFieldConfig.fieldtype as 'html' | 'richtext';
            }
            const translations = this.model.getField(this.fieldname);
            if (!window._.isEmpty(translations)) {
                ref.instance.setTranslationsArray(Object.values(translations));
            }

            effect(() => {

                const translations: ModuleFieldTranslationsObjectI = ref.instance.translations();

                if (translations) {
                    Object.values(translations).forEach(translation => {
                        translation.id = this.model.generateGuid();
                        translation.bean_module = this.model.module;
                        translation.bean_id = this.model.id;
                        translation.field_name = this.textFieldName;
                    });

                    this.model.setField(this.fieldname, translations);
                }
            }, {injector: this.injector});
        });
    }
}