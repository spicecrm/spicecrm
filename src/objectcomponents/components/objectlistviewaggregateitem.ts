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
     * the metric to be displayed
     */
    @Input() public metric: string = 'doc_count';

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
     * disables the checkbox when the list is loading or another aggregate has been changed
     */
    get disabled(){
        return this.modellist.isLoading|| !this.modellist.canChangeAggegate(this.aggregatename);
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
            this.modellist.scheduleReloadList();
        } else {
            const removed = this.modellist.removeAggregate(this.aggregatename, this.bucketitem.aggdata);
            if (removed) this.modellist.scheduleReloadList();
        }
    }

    /**
     * the getter for the checkvox value
     */
    get checked() {
        return this.modellist.checkAggregate(this.aggregatename, this.bucketitem.aggdata);
    }

    get metricValue(){
        switch (this.metric){
            case 'doc_count':
                return this.bucketitem.doc_count;
            default:
                return this.bucketitem[this.metric].value;
        }
    }
}
