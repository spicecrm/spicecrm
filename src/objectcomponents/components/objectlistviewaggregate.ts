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
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregate.html'
})
export class ObjectListViewAggregate {

    /**
     * an input for teh aggregate itself
     */
    @Input() public aggregate: any = {};

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
}
