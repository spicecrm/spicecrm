/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'object-record-fieldset-field',
    templateUrl: '../templates/objectrecordfieldsetfield.html'
})
export class ObjectRecordFieldsetField {

    @Input() public fieldsetitem: any;
    @Input() public fieldpadding: string = 'x-small';
    @Input() public fielddisplayclass: string = 'slds-has-divider--bottom slds-p-vertical--x-small spice-fieldminheight';


    public showLabel(fieldConfig) {
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
