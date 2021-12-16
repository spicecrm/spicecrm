/**
 * @module ObjectComponents
 */
import {
    Component,
    ElementRef, Input, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modellist} from '../../services/modellist.service';

/**
 * component being part of the ObjectListViewAggregate .. renders the value of the aggregate and a checkbox
 */
@Component({
    selector: 'object-listview-aggregate-item',
    templateUrl: '../templates/objectlistviewaggregateitem.html'
})
export class ObjectListViewAggregateItem {

    /**
     * ths item in teh bucket
     */
    @Input() public bucketitem: any = {};

    /**
     * the aggregate we are actually on
     */
    @Input() public aggregate: any = {};

    /**
     * internal flag if the claue is checked
     */
    public isChecked: boolean = false;

    constructor(public elementRef: ElementRef, public language: language, public metadata: metadata, public modellist: modellist) {

    }

    /**
     * gets the name of the aggregate
     */
    get aggregatename() {
        return this.aggregate.indexfieldname?.replace(/>/g, '');
    }

    /**
     * returns if the modellist is loading and thus disabled the checkboxes
     */
    get loading() {
        return this.modellist.isLoading;
    }

    /**
     * a setter for the checked value of teh checkbox. A change triggers teh set int eh listservice and a refiltering
     *
     * @param value
     */
    set checked(value) {
        this.isChecked = value;
        if (value) {
            this.modellist.setAggregate(this.aggregatename, this.bucketitem.aggdata);
            this.modellist.reLoadList();
        } else {
            const removed = this.modellist.removeAggregate(this.aggregatename, this.bucketitem.aggdata);
            if (removed) this.modellist.reLoadList();
        }
    }

    /**
     * the getter for the checkvox value
     */
    get checked() {
        return this.modellist.checkAggregate(this.aggregatename, this.bucketitem.aggdata);
    }
}
