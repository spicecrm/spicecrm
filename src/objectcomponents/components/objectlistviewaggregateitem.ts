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
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregateitem.html'
})
export class ObjectListViewAggregateItem {

    /**
     * ths item in teh bucket
     */
    @Input() private bucketitem: any = {};

    /**
     * the aggregate we are actually on
     */
    @Input() private aggregate: any = {};

    /**
     * internal flag if the claue is checked
     */
    private isChecked: boolean = false;

    constructor(private elementRef: ElementRef, private language: language, private metadata: metadata, private modellist: modellist) {

    }

    /**
     * a setter for the checked value of teh checkbox. A change triggers teh set int eh listservice and a refiltering
     *
     * @param value
     */
    set checked(value) {
        this.isChecked = value;
        if (value) {
            this.modellist.setAggregate(this.aggregate.aggregateindex, this.bucketitem.aggdata);
        } else {
            this.modellist.removeAggregate(this.aggregate.aggregateindex, this.bucketitem.aggdata);
        }
    }

    /**
     * the getter for the checkvox value
     */
    get checked() {
        return this.modellist.checkAggregate(this.aggregate.aggregateindex, this.bucketitem.aggdata);
    }

}