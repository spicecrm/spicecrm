/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

/**
 * renders a panel with the actual aggregtaes retrieved for the current search
 */
@Component({
    selector: 'object-listview-aggregates-panel',
    templateUrl: '../templates/objectlistviewaggregatespanel.html',
    host:{
        class : 'slds-is-fixed'
    }
})
export class ObjectListViewAggregatesPanel {

    constructor(
        public elementRef: ElementRef,
        public language: language,
        public metadata: metadata,
        public modellist: modellist
    ) {

    }

    /**
     * a getter for the aggregates
     */
    get aggregates() {
        return this.modellist.moduleAggregates;
    }

    /**
     * returns true if the aggregtaes have a tag element
     */
    get hasTags(): boolean {
        return this.metadata.checkTagging(this.modellist.module);
    }

    /**
     * reset all aggregate filters
     */
    public clearAggregates() {
        this.modellist.removeAllAggregates(true);
        this.modellist.reLoadList();
    }

}
