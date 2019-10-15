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
    templateUrl: './src/objectfields/templates/fieldlookupsearchitem.html',
    providers: [model, view]
})
export class fieldLookupSearchItem {
    @Input() private hit: any = {};

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(private model: model, private view: view, private language: language, private metadata: metadata) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.hit._type;
        this.model.id = this.hit._id;

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        if (componentconfig && componentconfig.mainfieldset) this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        if (componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);

        for (let field in this.hit._source) {
            this.model.data[field] = this.hit._source[field];
        }
    }

}
