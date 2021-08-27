/**
 * @module ObjectComponents
 */

import {Component, Input, } from '@angular/core';

@Component({
    selector: 'object-record-details-tab-row-field',
    templateUrl: './src/objectcomponents/templates/objectrecorddetailstabrowfield.html'
})
export class ObjectRecordDetailsTabRowField {

    @Input() field: any = {};

    constructor() {

    }
}