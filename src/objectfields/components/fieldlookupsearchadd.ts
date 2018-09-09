import {Component, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';

@Component({
    selector: '[field-lookup-search-add]',
    templateUrl: './src/objectfields/templates/fieldlookupsearchadd.html',
    providers: [model]
})
export class fieldLookupSearchAdd implements OnInit {
    @Input() module: string = '';
    @Input() fieldid: string = '';

    constructor(public model: model, public language: language, public popup: popup) {
    }

    ngOnInit() {
        this.model.module = this.module;
    }

    addParent() {
        this.model.addModel(this.fieldid);
    }
}