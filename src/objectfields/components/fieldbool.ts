/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

/**
 * renders a boolean field (Checkbox)
 */
@Component({
    selector: 'field-bool',
    templateUrl: '../templates/fieldbool.html'
})
export class fieldBool extends fieldGeneric {

    /**
     * hack to size the field properly in detail views
     *
     * ToDo: find a nicer way to style the systemcheckbox so it only consumes the sace needed
     */
    get fieldbooldisplayclass(){
        return this.fielddisplayclass.replace('slds-p-vertical--x-small', 'slds-p-bottom--xxx-small slds-p-top--x-small');
    }
}
