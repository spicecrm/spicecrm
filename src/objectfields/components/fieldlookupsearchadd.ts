/**
 * @module ObjectFields
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: '[field-lookup-search-add]',
    templateUrl: './src/objectfields/templates/fieldlookupsearchadd.html',
    providers: [model]
})
export class fieldLookupSearchAdd implements OnInit {

    @Input() private module = '';
    @Input() private fieldid = '';
    @Output('added') private added$ = new EventEmitter();

    constructor( public model: model, public language: language ) { }

    public ngOnInit() {
        this.model.module = this.module;
    }

    private addParent() {
        this.model.addModel( this.fieldid, null, null, true ).subscribe( (ret) => {
            this.added$.emit({ id: ret.id, text: ret.summary_text, data: ret });
        });
    }

}
