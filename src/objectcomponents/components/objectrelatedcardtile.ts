/**
 * Created by christian on 08.11.2016.
 */
import {Component, Input, AfterViewInit} from '@angular/core';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import {Router, ActivatedRoute}   from '@angular/router';

@Component({
    selector: '[object-related-card-tile]',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardtile.html',
    providers: [model, view]
})
export class ObjectRelatedCardTile{

    @Input() module : string = '';
    @Input() data : any = {};
    @Input() fieldset : string = '';
    addActions = [{action: 'remove', name: 'Remove'}];

    constructor(private model: model, private relatedmodels: relatedmodels, private view: view, private language: language, private metadata: metadata, private router: Router) {

    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.data = this.data;
    }

    getFields(){
        return this.metadata.getFieldSetFields(this.fieldset)
    }

    navgiateDetail(){
        this.model.goDetail();
    }

    handleAction(event){
        switch(event){
            case 'remove':
                this.relatedmodels.deleteItem(this.model.id);
                break;
        }
    }
}