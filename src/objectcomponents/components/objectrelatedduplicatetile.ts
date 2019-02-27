
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import {Router, ActivatedRoute}   from '@angular/router';

@Component({
    selector: 'object-related-duplicate-tile',
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicatetile.html',
    providers: [view]
})
export class ObjectRelatedDuplicateTile implements OnInit{

    private fieldset: string = '';

    constructor(private model: model, private view: view, private language: language, private metadata: metadata) {

    }

    public ngOnInit() {

        let componentconfig = this.metadata.getComponentConfig('ObjectRelatedDuplicateTile', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }

    private getFields(){
         return this.metadata.getFieldSetFields(this.fieldset)
    }

    private navgiateDetail(){
        this.model.goDetail();
    }

}