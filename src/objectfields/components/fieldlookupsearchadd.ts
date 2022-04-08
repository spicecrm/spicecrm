/**
 * @module ObjectFields
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: '[field-lookup-search-add]',
    templateUrl: '../templates/fieldlookupsearchadd.html',
    providers: [model]
})
export class fieldLookupSearchAdd implements OnInit {

    @Input() public module = '';
    @Input() public parent: any;
    @Output('added') public added$ = new EventEmitter();

    constructor( public model: model, public language: language ) { }

    public ngOnInit() {
        this.model.module = this.module;
    }

    public addParent() {
        this.model.addModel( '', this.parent, null, true ).subscribe( (ret) => {
            this.added$.emit({ id: ret.id, text: ret.summary_text, data: ret });
        });
    }

}
