/**
 * @module ObjectFields
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'field',
    templateUrl: './src/objectfields/templates/field.html',
    host:{
        '[class.slds-form-element]' : 'true'
    }
})
export class field{
    @Input() private field: any = {};
}
