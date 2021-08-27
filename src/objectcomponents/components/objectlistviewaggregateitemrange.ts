/**
 * @module ObjectComponents
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a term Aggregate range using an item
 *
 * this bascially renders two ObjectListViewAggregateItemTerm components
 */
@Component({
    selector: 'object-listview-aggregate-item-range',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregateitemrange.html'
})
export class ObjectListViewAggregateItemRange  {

    /**
     * the item in the aggregate
     */
    @Input() private item: any = {};

    /**
     * the aggregate
     */
    @Input() private aggregate: any = {};

    /**
     * @ignore
     *
     * @param model
     */
    constructor(private model: model) {

    }
}
