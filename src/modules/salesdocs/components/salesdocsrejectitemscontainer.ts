/**
 * @module ModuleSalesDocs
 */
import {
    Component, ElementRef, Injector, QueryList, ViewChildren
} from '@angular/core';

import {SalesDocsItemsContainer} from "./salesdocsitemscontainer";
import {salesdocrecord} from "../services/salesdocrecord";
import {SalesDocsItemRejectContainer} from "./salesdocsitemrejectcontainer";
import {configurationService} from "../../../services/configuration.service";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: 'salesdocs-reject-items-container',
    templateUrl: '../templates/salesdocsrejectitemscontainer.html',
    providers:[salesdocrecord]
})
export class SalesDocsRejectItemsContainer extends SalesDocsItemsContainer {
    /**
     * reference to the navigation tabs
     */

    @ViewChildren(SalesDocsItemRejectContainer)public rejectItems: QueryList<SalesDocsItemRejectContainer>;

    constructor(
        public userpreferences: userpreferences,
        public injector: Injector,
        public language: language,
        public backend: backend,
        public elementRef: ElementRef,
        public model: model,
        public modal: modal,
        public view: view,
        public configuration: configurationService,
        public metadata: metadata,
        public broadcast: broadcast,
        public salesdocrecord: salesdocrecord
    ) {
        super(userpreferences, injector, language, backend, elementRef, model, modal, view, configuration, metadata, broadcast, salesdocrecord);

        // initialize the saledocrecord
        this.salesdocrecord.salesDoc = this.model;
    }

    /**
     * a getter that returns true if any dirty model is found so a rejedction reason has been set
     */
    get hasDirtyModels(){
        if(!this.rejectItems) return false;

        let anyDirty: boolean = false;
        this.rejectItems.forEach(i => {
            if(i.model.isDirty()) {
                anyDirty = true
            };
        })
        return anyDirty;
    }

    /**
     * returns the dirty models and the dirtty fields
     */
    public getDirtyItems(){
        let items: any = {};
        this.rejectItems.forEach(i => {
            if(i.model.isDirty()) {
                items[i.model.id] = i.model.getDirtyFields();
            };
        })
        return items;
    }

}
