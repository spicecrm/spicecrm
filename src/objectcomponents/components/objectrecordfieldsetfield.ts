/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'object-record-fieldset-field',
    templateUrl: './src/objectcomponents/templates/objectrecordfieldsetfield.html'
})
export class ObjectRecordFieldsetField {

    @Input() private fieldsetitem: string = '';
    @Input() private fieldpadding: string = 'x-small';
    @Input() private fielddisplayclass: string = 'slds-has-divider--bottom slds-p-vertical--x-small spicecrm-fieldminheight';


    private showLabel(fieldConfig) {
        if (fieldConfig.hidelabel === true) {
            return false;
        } else {
            return true;
        }
    }

    get padding(){
        return this.fieldpadding ? 'slds-p-around--' + this.fieldpadding : '';
    }
}
