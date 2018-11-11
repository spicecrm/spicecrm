import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {language} from "../../services/language.service";
import {relatedmodels} from "../../services/relatedmodels.service";

import {ObjectRelatedlistList} from "./objectrelatedlistlist";


@Component({
    selector: 'object-model-popover-related',
    templateUrl: './src/objectcomponents/templates/objectmodelpopoverrelated.html',
    providers: [relatedmodels]
})
export class ObjectModelPopoverRelated extends ObjectRelatedlistList {

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        private router: Router
    ) {
        super(language, metadata, relatedmodels, model);
    }


    get canViewAll() {
        return this.relatedmodels.count > 0 && this.relatedmodels.count > this.relatedmodels.loaditems;
    }

    private showAll() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
    }

}
