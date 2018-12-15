import { Component, Input, OnInit } from '@angular/core';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';
import { popup } from '../../services/popup.service';

@Component({
    selector: '[field-lookup-search-add]',
    templateUrl: './src/objectfields/templates/fieldlookupsearchadd.html',
    providers: [model]
})
export class fieldLookupSearchAdd implements OnInit {

    @Input() private module = '';
    @Input() private fieldid = '';

    constructor( public model: model, public language: language, public popup: popup ) { }

    public ngOnInit() {
        this.model.module = this.module;
    }

    private addParent() {
        this.model.addModel( this.fieldid, null, null, true );
    }

}
