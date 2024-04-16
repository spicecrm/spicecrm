/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {duplicatedmodels} from "../../services/duplicatedmodels.service";
import {relatedmodels} from "../../services/relatedmodels.service";

/**
 * the footer in the object-duplicates-related-card
 *
 * This triggers a dropdown field which displays/hides duplicates according to their status
 */
@Component({
    selector: 'object-related-duplicates-card-footer',
    templateUrl: '../templates/objectrelatedduplicatescardfooter.html',
    providers: []
})
export class ObjectRelatedDuplicatesCardFooter implements OnInit {

    /**
     * holds the domain validation values
     */
    public duplicateStatusDom: any = {};

    constructor(
        public relatedmodels: relatedmodels,
        public language: language,
        public duplicatedModels: duplicatedmodels
    ) {
    }

    public ngOnInit() {
        this.duplicateStatusDom = this.language.languagedata.applist.duplicate_status_dom;
    }
}
