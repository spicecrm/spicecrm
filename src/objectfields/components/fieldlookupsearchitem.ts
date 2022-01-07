/**
 * @module ObjectFields
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: '[field-lookup-search-item]',
    templateUrl: '../templates/fieldlookupsearchitem.html',
    providers: [model, view]
})
export class fieldLookupSearchItem {
    @Input() public item: any = {};
    @Input() public module: string;

    public mainfieldsetfields: any[];
    public subfieldsetfields: any[];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.item.id;
        this.model.setData(this.item);

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        if (componentconfig && componentconfig.mainfieldset) this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        if (componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
    }
}
