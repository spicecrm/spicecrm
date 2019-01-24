import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-record-fieldset',
    templateUrl: './src/objectcomponents/templates/objectrecordfieldset.html'
})
export class ObjectRecordFieldset implements OnInit {

    @Input() private fieldset: string = '';
    @Input() private fieldpadding: string = 'x-small';
    @Input() private fielddisplayclass: string = 'slds-has-divider--bottom slds-p-vertical--x-small spicecrm-fieldminheight';
    @Input() private direction: string = 'horizontal';

    private fieldsetitems: any[] = [];
    private numberOfColumns: number = 0; // in grid

    constructor(private metadata: metadata, private model: model) {
    }

    public ngOnInit() {
        this.fieldsetitems = this.metadata.getFieldSetItems(this.fieldset);
        for (let item of this.fieldsetitems) {
            this.numberOfColumns = this.numberOfColumns + (item.fieldconfig.width ? item.fieldconfig.width * 1 : (item.fieldconfig.width = 1));
        }
        if (!this.renderVertical && this.numberOfColumns > 8) console.warn('wrong fieldset grid (' + this.fieldset + ')');
    }

    get renderVertical() {
        return this.direction == 'vertical' ? true : false;
    }

    private isField(fieldsetitem) {
        return fieldsetitem.field ? true : false;
    }

    private sizeClass(i) {
        return this.renderVertical ? '' :  ' slds-medium-size--' + this.fieldsetitems[i].fieldconfig.width + '-of-' + this.numberOfColumns;
    }
}
