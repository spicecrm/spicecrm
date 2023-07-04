/**
 * @module ObjectComponents
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

/**
 * a componentn that displays one set of aggregtaes returned from the Elastic Search
 */
@Component({
    selector: 'object-listview-aggregate',
    templateUrl: '../templates/objectlistviewaggregate.html'
})
export class ObjectListViewAggregate {

    /**
     * an input for teh aggregate itself
     */
    @Input() public aggregate: any = {};

    /**
     * list the number of items that are displayed by  default
     */
    public aggregateDefaultItems = 5;

    /**
     * inidcates that all shoudl be shopwn
     */
    public showall: boolean = false;

    constructor(public language: language, public modellist: modellist, public model: model) {
    }

    /**
     * returns the items for teh display of the source of teh aggregate
     *
     * This is
     *  - the module if different ot the model
     *  - the fieldname
     */
    get aggregateNameItems(): string[] {
        let nameItems = [];
        if (this.aggregate.fielddetails) {
            if (this.model.module != this.aggregate.fielddetails.module) {
                nameItems.push(this.language.getModuleName(this.aggregate.fielddetails.module, true));
            }

            nameItems.push(this.language.getFieldDisplayName(this.aggregate.fielddetails.module, this.aggregate.fielddetails.field));
        }
        return nameItems;
    }

    /**
     * gets the name of the aggregate
     */
    get aggregatename() {
        return this.aggregate.indexfieldname?.replace(/>/g, '');
    }

    /**
     * returns the aggregate bucket count
     */
    get aggregateBucketCount() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].buckets.length;
        } else {
            return 0;
        }
    }

    /**
     * returns the buckets from the modellist service
     */
    get aggregateBuckets() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            // show all or the first five plus all selected
            return this.modellist.searchAggregates?.[this.aggregatename].buckets.filter((a, i) => this.showall || i < this.aggregateDefaultItems || this.modellist.checkAggregate(this.aggregatename, a.aggdata));
        } else {
            return [];
        }
    }

    /**
     * returns the count of the documents not considered in teh aggregate
     */
    get otherDocCount() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].sum_other_doc_count;
        } else {
            return 0;
        }
    }

    /**
     * returns the number of the checked aggregates
     */
    get checkdCount() {
        return this.modellist.getCheckedAggregateCount(this.aggregatename);
    }

    /**
     * returns if the aggregate is collapsed
     */
    get collapsed() {
        return !!this.aggregate.collapsed;
    }

    /**
     * toggles the collapsed status
     */
    public toggleCollapsed() {
        this.aggregate.collapsed = !this.aggregate.collapsed;
    }
}
