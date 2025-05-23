/**
 * @module ObjectComponents
 */

import {Component, Input, } from '@angular/core';

@Component({
    selector: 'object-record-details-tab-row-field',
    templateUrl: '../templates/objectrecorddetailstabrowfield.html',
    standalone: false
})
export class ObjectRecordDetailsTabRowField {

    @Input() field: any = {};

    constructor() {

    }
}
