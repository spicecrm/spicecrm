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
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregatespanel.html'
})
export class ObjectListViewAggregatesPanel {

    constructor(
        private elementRef: ElementRef,
        private language: language,
        private metadata: metadata,
        private modellist: modellist
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
    private clearAggregates() {
        this.modellist.removeAllAggregates();
    }

}
