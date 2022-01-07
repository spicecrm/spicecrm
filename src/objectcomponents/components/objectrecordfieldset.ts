/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a fieldset
 *
 * requires a component that provides a model and view
 */
@Component({
    selector: 'object-record-fieldset',
    templateUrl: '../templates/objectrecordfieldset.html'
})
export class ObjectRecordFieldset implements OnInit {

    /**
     * the id of the fieldset to be rendered
     */
    @Input() public fieldset: string = '';

    /**
     * the direction to render this fieldset. Thsi decides if the start is vertical or horizontal. Typical for a listview it is horizontal, for a record it is vertical
     */
    @Input() public direction: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * a padding class to be applied
     */
    @Input() public fieldpadding: string = 'xx-small';

    /**
     * an optional set of classes that will be applied to fields in teh fieldset
     */
    @Input() public fielddisplayclass: string = 'slds-has-divider--bottom slds-p-vertical--x-small spice-fieldminheight';


    /**
     * internal array of the fieldset items
     */
    public fieldsetitems: any[] = [];

    /**
     * @ignore
     *
     * helper for the number of columns
     */
    public numberOfColumns: number = 0; // in grid

    constructor(public metadata: metadata, public model: model, public view: view) {
    }

    /**
     * @ignore
     *
     * loads the fieldsetitems and determines the number of columns to be rendered
     */
    public ngOnInit() {
        this.fieldsetitems = this.metadata.getFieldSetItems(this.fieldset);
        for (let item of this.fieldsetitems) {
            this.numberOfColumns = this.numberOfColumns + (item.fieldconfig.width ? item.fieldconfig.width * 1 : (item.fieldconfig.width = 1));
        }
        if (!this.renderVertical && ( this.numberOfColumns > 8 && this.numberOfColumns !== 12 )) console.warn('wrong fieldset grid (' + this.fieldset + ')');
    }

    /**
     * a helper getter to determine the direction
     */
    get renderVertical() {
        return this.direction == 'vertical' ? true : false;
    }

    public isField(fieldsetitem) {
        return fieldsetitem.field ? true : false;
    }

    /**
     * a helper for the item to determine the size class in the grid
     *
     * @param i the index of the item
     */
    public sizeClass(i) {
        // render vertical ... none
        if (this.renderVertical) return '';

        // in case of small view sioze 1-of-1
        if (this.view.size == 'small') return 'slds-size--1-of-1';

        // regular -- calulate grid
        return 'slds-size--' + this.fieldsetitems[i].fieldconfig.width + '-of-' + this.numberOfColumns;
    }
}
