/**
 * @module ObjectFields
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {view} from "../../services/view.service";
import {Router} from "@angular/router";

@Component({
    selector: 'field-lookup-recent-item',
    templateUrl: './src/objectfields/templates/fieldlookuprecentitem.html',
    providers: [model, view]
})
export class fieldLookupRecentItem implements OnInit {

    @Input() private item: any = {};

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(private model: model, private router: Router, private language: language, private metadata: metadata, private view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.item.module_name;
        this.model.id = this.item.item_id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item.data);
        // this.model.data.summary_text = this.item.item_summary;

        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderSearchResultsItem', this.model.module);
        if(componentconfig && componentconfig.mainfieldset) this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        if(componentconfig && componentconfig.subfieldset) this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);

    }
}
