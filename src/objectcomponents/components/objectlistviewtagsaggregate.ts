/**
 * @module ObjectComponents
 */
import {
    Component,
    Input
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {ObjectListViewAggregate} from './objectlistviewaggregate';

/**
 * renders a container with the tags returned as aggregates from teh elastic qewury. This also allows filtering by clicking on any of the tags
 */
@Component({
    selector: 'object-listview-tags-aggregate',
    templateUrl: '../templates/objectlistviewtagsaggregate.html'
})
export class ObjectListViewTagsAggregate extends ObjectListViewAggregate {

    public aggregate = {
        indexfieldname: 'tags'
    }

    constructor(public language: language, public modellist: modellist, public model: model) {
        super(language, modellist, model);
    }

    /**
     * a simple getter to check if there are any buckets on teh aggegarete. If not a message is renderesd that no records are tagged
     */
    get hasItems() {
        try {
            return this.aggregateBuckets.length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * returns if the current item (tag) is active
     * @param tag the item record from the elastic response
     */
    public isactive(tag) {
        return this.modellist.checkAggregate('tags', tag.aggdata);
    }

    /**
     * toggles a tag active or inactive
     *
     * @param tag the item record from the elastic response
     */
    public toggle(tag) {
        if (!this.isactive(tag)) {
            this.modellist.setAggregate('tags', tag.aggdata);
            this.modellist.reLoadList();
        } else {
            const removed = this.modellist.removeAggregate('tags', tag.aggdata);
            if (removed) this.modellist.reLoadList();
        }
    }
}
