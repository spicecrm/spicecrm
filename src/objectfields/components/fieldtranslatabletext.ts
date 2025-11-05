import {Component, effect, inject, Injector, OnInit} from '@angular/core';
import {fieldText} from "./fieldtext";
import {ObjectFieldTranslationsModal} from "../../objectcomponents/components/objectfieldtranslationsmodal";
import {ModuleFieldTranslationI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";

@Component({
    selector: 'field-translatable-text',
    templateUrl: '../templates/fieldtranslatabletext.html',
    standalone: false
})
export class FieldTranslatableText extends fieldText implements OnInit {
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
    public textFieldConfig: {fieldtype: string, hidelabel: boolean};

    public ngOnInit() {
        super.ngOnInit();
        this.initializeTextFieldConfig();
    }

    /**
     * initialize the text field config
     * @private
     */
    private initializeTextFieldConfig() {
        this.textFieldConfig = {...this.fieldconfig};
        this.textFieldConfig.hidelabel = true;
        this.textFieldName = this.fieldname.replace('_translations', '');
        this.textFieldConfig.fieldtype = this.metadata.getFieldType(this.model.module, this.textFieldName);

    }

    /**
     * open the translation modal
     */
    public openTranslationsModal() {

        this.modal.openStaticModal(ObjectFieldTranslationsModal, true, this.injector).subscribe(ref => {

            ref.instance.isEditMode = this.isEditMode();
            ref.instance.originalText = this.model.getField(this.textFieldName);
            const translations = this.model.getField(this.fieldname);
            if (Array.isArray(translations)) {
                ref.instance.setTranslations(this.model.getField(this.fieldname));
            }

            effect(() => {

                const translations: ModuleFieldTranslationI[] = ref.instance.translations();

                if (translations) {
                    translations.forEach(translation => {
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