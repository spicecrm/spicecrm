/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-system-label',
    templateUrl: '../templates/fieldsystemlabel.html',
    standalone: false
})
export class fieldSystemLabel extends fieldGeneric {
}
