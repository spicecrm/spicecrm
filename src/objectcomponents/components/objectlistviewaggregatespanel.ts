/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {model} from '../../services/model.service';

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
        private modellist: modellist,
        private model: model
    ) {

    }

    /**
     * calculates the offset for the panel
     */
    private getPanelStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    /**
     * a getter for the aggregates
     */
    private getAggregates() {
        let aggArray = [];
        for (let aggregate in this.modellist.searchAggregates) {
            if (aggregate != 'tags' && this.modellist.searchAggregates.hasOwnProperty(aggregate)) {
                aggArray.push(this.modellist.searchAggregates[aggregate]);
            }
        }

        return aggArray;
    }

    /**
     * returns true if the aggregtaes have a tag element
     */
    get hasTags(): boolean {
        return this.metadata.checkTagging(this.model.module);
    }

    get tagsaggregate(): any[] {
        return this.modellist.searchAggregates && this.modellist.searchAggregates.hasOwnProperty('tags') ? this.modellist.searchAggregates.tags : [];
    }

    /**
     * reset all aggregate filters
     */
    private clearAggregates() {
        this.modellist.removeAllAggregates();
    }
}
