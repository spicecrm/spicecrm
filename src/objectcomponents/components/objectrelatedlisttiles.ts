/**
 * @module ObjectComponents
 */
import {
    Component,
    AfterViewInit,
    OnInit,
    ViewChildren,
    QueryList,
    ElementRef,
    ChangeDetectorRef,
    ViewChild, ViewContainerRef
} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router} from '@angular/router';
import {ObjectRelatedList} from "./objectrelatedlist";

@Component({
    selector: 'object-relatedlist-tiles',
    templateUrl: '../templates/objectrelatedlisttiles.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistTiles extends ObjectRelatedList {

    /**
     * container reference for the main div
     */
    @ViewChild('mainContainer', {read: ViewContainerRef, static: true}) public mainContainer: ViewContainerRef;

    constructor(public language: language,
                public metadata: metadata,
                public relatedmodels: relatedmodels,
                public model: model,
                public cdref: ChangeDetectorRef,
                public el: ElementRef) {
        super(language, metadata, relatedmodels, model, cdref);
    }

    get getTileWidthClass() {
        if(this.mainContainer?.element.nativeElement.clientWidth <= 550) {
            return 'slds-size--1-of-1';
        } else {
            if(this.mainContainer?.element.nativeElement.clientWidth <= 730) {
                return 'slds-size--1-of-2';
            } else {
                return 'slds-size--1-of-3';
            }
        }
    }
}
