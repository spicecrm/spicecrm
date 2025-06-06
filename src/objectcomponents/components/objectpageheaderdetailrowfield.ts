/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: '[object-page-header-detail-row-field]',
    templateUrl: '../templates/objectpageheaderdetailrowfield.html',
    standalone: false
})
export class ObjectPageHeaderDetailRowField{
    @Input() moduleName: any = '';
    @Input() field: any = {};
}
