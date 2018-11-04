import {Component, Input, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {language} from "../../services/language.service";
import {relatedmodels} from "../../services/relatedmodels.service";

import {ObjectRelatedlistList} from "./objectrelatedlistlist";


@Component({
    selector: 'object-model-popover-related-item',
    templateUrl: './src/objectcomponents/templates/objectmodelpopoverrelateditem.html',
    providers: [model, view]
})
export class ObjectModelPopoverRelatedItem {

    @Input() private module: string = '';
    @Input() private item: any = {};
    @Input() private fields: Array<any> = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public view: view
    ) {

    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.item.id;
        this.model.data = this.item;
    }

    private goDetail() {
        this.model.goDetail();
    }

}
