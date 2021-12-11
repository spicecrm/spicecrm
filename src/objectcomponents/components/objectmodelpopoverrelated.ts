/**
 * @module ObjectComponents
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from "../../services/language.service";
import {relatedmodels} from "../../services/relatedmodels.service";

import {ObjectRelatedlistList} from "./objectrelatedlistlist";


@Component({
    selector: 'object-model-popover-related',
    templateUrl: '../templates/objectmodelpopoverrelated.html',
    providers: [relatedmodels]
})
export class ObjectModelPopoverRelated extends ObjectRelatedlistList {

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public cdref: ChangeDetectorRef,
        public router: Router
    ) {
        super(language, metadata, relatedmodels, model, cdref);
    }


    get canViewAll() {
        return this.relatedmodels.count > 0 && this.relatedmodels.count > this.relatedmodels.loaditems;
    }

    public showAll() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
    }

}
