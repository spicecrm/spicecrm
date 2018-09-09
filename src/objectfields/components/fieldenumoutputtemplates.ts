import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'field-output-templates',
    templateUrl: './src/objectfields/templates/fieldoutputtemplates.html'
})
export class FieldEnumOutputTemplates extends fieldGeneric implements OnInit{

    isLoaded: boolean = false;
    items = [];
    @Output('select') select$ = new EventEmitter();
    private _selected_item = null;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
    ) {
        super(model, view, language, metadata, router);
    }

    get subjectField(){
        return this.fieldconfig.subject ? this.fieldconfig.subject : 'name';
    }

    get bodyField(){
        return this.fieldconfig.body ? this.fieldconfig.body : 'description_html';
    }

    get isDisabled(){
        return !this.isLoaded || !this.items;
    }

    get selected_item()
    {
        return this._selected_item;
    }

    set selected_item(val)
    {
        this._selected_item = val;
        this.select$.emit(val);
        this.value = val.id;
    }

    ngOnInit(){
        //console.log(this.model.data, this.model.module);
        let params = {
            searchfields:
                {
                    join: 'AND',
                    conditions:[
                        {field: 'module_name', operator: '=', value: this.model.module}
                    ]
                }
        };

        this.backend.all('OutputTemplates', params).subscribe(
            (data: any) => {
                this.items = data;

                if( !this.selected_item && this.value )
                {
                    for(let item of this.items)
                    {
                        if(this.value == item.id)
                            this.selected_item = item;
                    }
                }

            }
        );

        this.isLoaded = true;
    }

}