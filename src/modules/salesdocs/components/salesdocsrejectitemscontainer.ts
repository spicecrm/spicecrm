/**
 * @module ModuleSalesDocs
 */
import {
    Component, QueryList, ViewChildren
} from '@angular/core';

import {SalesDocsItemsContainer} from "./salesdocsitemscontainer";
import {salesdocrecord} from "../services/salesdocrecord";
import {SalesDocsItemRejectContainer} from "./salesdocsitemrejectcontainer";

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

    /**
     * a getter that returns true if any dirty model is found so a rejedction reason has been set
     */
    get hasDirtyModels(){
        if(!this.rejectItems) return false;

        let anyDirty: boolean = false;
        this.rejectItems.forEach(i => {
            if(i.model.isDirty()) {
                console.log(i.model.getDirtyFields());
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
