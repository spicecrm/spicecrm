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
export class LanguageLabelModal
{
    @Input() label: any = {};
    @Output('label') label$ = new EventEmitter();
    @Output('close') close$ = new EventEmitter();

    languages = [];
    self;

    constructor(
        private utils: modelutilities,
        private language: language,
        private backend: backend,
    ){
        this.languages = this.language.getAvialableLanguages(true);
    }

    get translations()
    {
        return this.label[this.label.scope+'_translations'] || [];
    }

    set translations(val)
    {
        this.label[this.label.scope+'_translations'] = val;
    }

    get name()
    {
        return this.label ? this.label.name : '';
    }

    set name(val)
    {
        val = val.toUpperCase().trim().replace('-','_');
        this.label.name = val;
    }

    get scope()
    {
        return this.label ? this.label.scope : '';
    }

    set scope(val)
    {
        // copy translations to the corresponding relation
        this.label[val+'_translations'] = this.translations;
        // erase the current translations...
        this.translations = [];

        this.label.scope = val;
    }

    validate()
    {
        // validation...
        if(!this.label.name) {
            //console.warn('name is empty!');
            return false;
        }
        if(/[^A-Z_0-9]/.test(this.label.name))
        {
            //console.warn('name regex failed!');
            return false;
        }
        for(let trans of this.translations)
        {
            if(!trans.translation_default)
            {
                // console.warn('default translation is missing!');
                return false;
            }
        }

        return true;
    }

    save()
    {
        this.label.name = this.label.name.toUpperCase();

        let valid = this.validate();
        //console.log(valid);
        if(!valid)
            return false;

        this.backend.postRequest('/syslanguages/labels', null, [this.label]).subscribe(
            (res) => {
                //console.log(res);
                this.label$.emit(this.label);
                this.close$.emit('save');
                this.self.destroy();
                // todo: relaod language labels?
            }
        );
    }

    cancelDialog()
    {
        this.label = {};
        this.label$.emit(null);
        this.close$.emit('cancel');
        this.self.destroy();
    }

    onModalEscX() {
        this.cancelDialog();
    }

    addTranslation(language_name:string = null)
    {
        if(!language_name)
        {
            let langs = this.getMissingLanguages();
            language_name = langs[0];
        }

        this.label[this.label.scope+'_translations'].push({
            id: this.utils.generateGuid(),
            syslanguagelabel_id: this.label.id,
            syslanguage: language_name,
        });
    }

    getMissingLanguages(scope:string = null):any[]
    {
        if(!scope)
            scope = this.scope;

        let missing_langs = [];
        for(let lang of this.languages)
        {
            if( !this.translations.find((e) => {return e.syslanguage == lang.language}) )
            {
                missing_langs.push(lang);
            }
        }
        return missing_langs;
    }

    getLangText(language){
        return this.language.getLangText(language);
    }
}