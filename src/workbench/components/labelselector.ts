import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from "../../services/modelutilities.service";

@Component({
    selector: 'label-selector',
    templateUrl: './src/workbench/templates/labelselector.html'
})
export class LabelSelectorComponent
{
    @Output('select') select$ = new EventEmitter();
    @Input('selected_item') private _selected_item = null;
    is_searching = false;
    items = [];
    show_results = false;
    show_modal = false;
    readonly max_results = 100;

    constructor(
        private language: language,
        private backend: backend,
        private utils: modelutilities,
    ) {

    }

    set selected_item(val)
    {
        this._selected_item = val;
        if(val)
        {
            this.select$.emit(val);
            this.show_results = false;
        }
    }

    get selected_item()
    {
        return this._selected_item;
    }

    search(search_term:string = null)
    {
        if(!search_term)
            return false;

        this.selected_item = null;
        this.is_searching = true;
        this.backend.getRequest('syslanguages/labels/search/'+search_term).subscribe(
            (res) => {
                this.items = res.slice(0,this.max_results);
                this.is_searching = false;
            }
        );
    }

    addItem()
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

        this._selected_item = label;
        this.items.push(label);
        this.show_modal = true;
    }

    onModalClose(event)
    {
        this.show_modal = false;
        switch(event)
        {
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