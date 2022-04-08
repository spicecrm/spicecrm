/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

/**
 * renders a boolean field (Checkbox) with the label next to the checkbox rather than on top.
 */
@Component({
    templateUrl: '../templates/fieldboollabelaligned.html'
})
export class fieldBoolLabelAligned extends fieldGeneric {

    /**
     * hack to size the field properly in detail views
     *
     * ToDo: find a nicer way to style the systemcheckbox so it only consumes the space needed
     */
    get fieldbooldisplayclass(){
        return this.fielddisplayclass.replace('slds-p-vertical--x-small', 'slds-p-bottom--xxx-small slds-p-top--x-small');
    }
}
