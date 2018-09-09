import {
    Component, Pipe, PipeTransform,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {footer} from "../../services/footer.service";
import { modal } from '../../services/modal.service';
//import { LanguageLabelModal } from './languagelabelmodal';
//import { LanguageLabelReferenceConfigModal } from './languagelabelreferenceconfigmodal';

@Component({
    selector: 'language-label-manager',
    templateUrl: './src/workbench/templates/languagelabelmanager.html',
})
export class LanguageLabelManagerComponent
{
    search_term: string = '';
    labels = [];
    languages = [];
    private _selected_label = null;
    is_searching = false;
    page = 1;
    translation_scope = 'global';
    scopes = ['global','custom'];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
        private toast: toast,
        private footer: footer,
        private modalservice: modal
    ){
        this.languages = this.language.getAvialableLanguages();
    }

    showRefModal() {
        this.modalservice.openModal('LanguageLabelReferenceConfigModal');
    }

    get selected_label()
    {
        return this._selected_label;
    }

    set selected_label(val)
    {
        this._selected_label = val;
        if(val) {
            // if no translation is found for the current translation scope, find the right one...
            if(val[this.translation_scope + '_translations'].length == 0) {
                for (let scope of this.scopes) {
                    if (val[scope + '_translations'].length > 0) {
                        this.translation_scope = scope;
                        break;
                    }
                }
                val[this.translation_scope + '_translations'].sort(
                    (a,b) => {
                        if(a.syslanguage == this.language.languagedata.languages.default || a.syslanguage < b.syslanguage)
                            return -1;
                        else if(a.syslanguage > b.syslanguage)
                            return +1;
                    }
                );
            }
        }
    }

    get translations()
    {
        return this.selected_label[`${this.translation_scope}_translations`];
    }

    search(search_term = null)
    {
        this.page = 1;
        if(!search_term)
            search_term = this.search_term;
        if(!search_term)
            return false;

        this.selected_label = null;
        this.is_searching = true;
        this.backend.getRequest('syslanguages/labels/search/'+this.search_term).subscribe(
            (res) => {
                this.labels = res;
                this.is_searching = false;
            }
        );
    }

    addTranslation(scope:string, language_name:string = null)
    {
        if( !this.selected_label[scope+'_translations'] )
            this.selected_label[scope+'_translations'] = [];

        if(!language_name)
        {
            let langs = this.getMissingLanguages(scope);
            language_name = langs[0];
        }

        this.selected_label[scope+'_translations'].push({
            id: this.utils.generateGuid(),
            syslanguagelabel_id: this.selected_label.id,
            syslanguage: language_name,
        });
    }

    getMissingLanguages(scope:string = null):any[]
    {
        if(!scope)
            scope = this.translation_scope;

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

    addLabel()
    {
        let label = {
            id: this.utils.generateGuid(),
            name: '',
            scope: 'custom',
            custom_translations: [],
            global_translations: [],
        };
        label.custom_translations.push(
            {
                id: this.utils.generateGuid(),
                syslanguagelabel_id: label.id,
                //syslanguage: this.language.currentlanguage,
                syslanguage: this.language.languagedata.languages.default,
            }
        );

        this.selected_label = label;
        this.labels.push(label);

        this.modalservice.openModal('LanguageLabelModal').subscribe( modal => {
            modal.instance.label = this.selected_label;
            modal.instance.label$.subscribe( value => {
               this.selected_label = value;
            });
            modal.instance.close$.subscribe( event => { this.closeModal(event); });
        });
    }

    deleteLabel(label)
    {
        this.modalservice.confirm( this.language.getLabel('LBL_DELETE_LABEL_TEXT'), this.language.getLabel('LBL_DELETE_LABEL_TITLE')).subscribe( ( decision ) => {
            if (decision) {
                this.backend.deleteRequest('/syslanguages/labels/'+label.id+'/'+label.source).subscribe(
                    (res) => {
                        for(let i = 0; i < this.labels.length; i++)
                        {
                            let lbl = this.labels[i];
                            if(lbl.id == label.id)
                            {
                                this.labels.splice(i, 1);
                            }
                        }
                        this.selected_label = null;
                    }
                );
            }
        });
    }

    save()
    {
        //this.backend.postRequest('/syslanguages/labels', null, this.labels).subscribe(
        this.backend.postRequest('/syslanguages/labels', null, [this.selected_label]).subscribe(
            (res) => {
                //console.log(res);
                // reload labels to show up in the application...
                this.language.loadLanguage();
                this.toast.sendToast('Label saved!');
            }
        );
    }

    closeModal(event)
    {
        switch(event)
        {
            case 'cancel':
                // remove empty or selected label from results...
                for (let i = 0; i < this.labels.length; i++) {
                    let lbl = this.labels[i];
                    if (lbl.name == '' || lbl.id == this.selected_label.id) {
                        this.labels.splice(i, 1);
                    }
                }
                break;
            case 'save':
                this.translation_scope = this.selected_label.scope;
                break;
        }

    }

    sortTranslations(a,b)
    {
        if(a.syslanguage == this.language.languagedata.languages.default || a.syslanguage < b.syslanguage)
            return -1;
        else if(a.syslanguage > b.syslanguage)
            return +1;
        else
            return 0;
    }

    /**
     * bad naming... don't use shortcuts, be more explicit with your arguments... if you name it language, I would guess it means a complete language object... instead it means the language_code, why not name it so?
     * also the "text" of a language could mean everything...
     * @param language
     * @returns {any}
     */
    getLangText(language){
        return this.language.getLangText(language);
    }

}


@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {
    transform(ary: any, fn: Function = (a,b) => a > b ? 1 : -1): any {
        return ary.sort(fn)
    }
}