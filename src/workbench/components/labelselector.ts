import {
    Component, EventEmitter, Input, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from "../../services/modelutilities.service";

@Component({
    selector: 'label-selector',
    templateUrl: './src/workbench/templates/labelselector.html'
})
export class LabelSelectorComponent {
    @Output('select') public select$ = new EventEmitter();
    @Input('selected_item') private _selected_item = null;
    @Input('disabled') private _disabled = false;
    @Input('option') private option: any = {};

    private is_searching = false;
    private items = [];
    private show_results = false;
    private show_modal = false;
    private readonly max_results = 100;

    private showInfo = false;

    constructor(
        private language: language,
        private backend: backend,
        private utils: modelutilities,
    ) {

    }

    private removeSelected() {
        this.selected_item = null;
    }


    set selected_item(val)
    {
        if(val != this._selected_item) {
            this.select$.emit(val);
        }
        if(val) {
            this.show_results = false;
        }
        this._selected_item = val;
    }

    get selected_item()
    {
        if(this._selected_item && this._selected_item.name == '') {this._selected_item = null;};
        return this._selected_item;
    }

    get disabled()
    {
        return this._disabled;
    }



    private removeSelection() {
        this.selected_item = null;
    }

    private search(search_term: string = null) {
        if(!search_term) {
            return false;
        }
        this._selected_item = null;
        this.is_searching = true;
        this.backend.getRequest('syslanguages/labels/search/'+search_term).subscribe(
            (res) => {
                let languages = this.setActualLanguage(res)
                this.items = languages.slice(0,this.max_results);
                this.is_searching = false;
            }
        );
    }

    private setActualLanguage(langs) {
        for(let lang of langs) {
            let defaultTrans = "";
            let translations = [];

            lang.currentTranslation = "";

            if(lang.scope == "custom" ) {
                translations = lang.custom_translations;
            }
            if(lang.scope == "global" ) {
                translations = lang.global_translations;
            }

            for (let tran of translations) {

                if(tran.syslanguage == "en_us") {
                    defaultTrans = tran.translation_default; // first default en_us
                }
                if(tran.syslanguage == "de_DE") {
                    defaultTrans = tran.translation_default; // second default de_DE
                }
                if (tran.syslanguage == this.language.currentlanguage) {
                    lang.currentTranslation = tran.translation_default; // current translation
                }
            }
            if(lang.currentTranslation == "") {
                lang.currentTranslation = defaultTrans;
            }
        }
        return langs;
    }

    private addItem() {
        let label = {
            id: this.utils.generateGuid(),
            name: 'LBL_',
            scope: 'custom',
            custom_translations: [],
            global_translations: [],
        };
        label.custom_translations.push(
            {
                id: this.utils.generateGuid(),
                syslanguagelabel_id: label.id,
                // syslanguage: this.language.currentlanguage,
                syslanguage: this.language.languagedata.languages.default,
            }
        );
        this._selected_item = label;
        this.items.push(label);
        this.show_modal = true;
    }

    public onModalClose(event) {
        this.show_modal = false;
        switch(event) {
            case 'cancel':
                // remove empty or selected label from results...
                for (let i = 0; i < this.items.length; i++) {
                    let lbl = this.items[i];
                    if (lbl.name == '' || lbl.id == this.selected_item.id) {
                        this.items.splice(i, 1);
                    }
                }
                this.selected_item = null;
                break;
            case 'save':
                this.select$.emit(this.selected_item);
                break;
        }
    }
}
