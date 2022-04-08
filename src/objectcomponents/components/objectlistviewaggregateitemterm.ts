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
 * renders a term Aggregate item using a field container
 */
@Component({
    selector: 'object-listview-aggregate-item-term',
    templateUrl: '../templates/objectlistviewaggregateitemterm.html',
    providers: [view, model]
})
export class ObjectListViewAggregateItemTerm implements OnInit {

    /**
     * the item in the aggregate
     */
    @Input() public item: any = {};

    /**
     * the aggregate
     */
    @Input() public aggregate: any = {};

    constructor(public model: model, public view: view) {
        this.view.displayLabels = false;
    }

    /**
     * initializes teh model with the module and the value for the one field
     */
    public ngOnInit(): void {
        this.model.module = this.aggregate.fielddetails.module;
        // convert the value to a model value .. fix for the boolean aggregate
        this.model.setField(this.aggregate.fielddetails.field, this.model.utils.backend2spice(this.model.module, this.aggregate.fielddetails.field,  this.item.key));
    }
}
