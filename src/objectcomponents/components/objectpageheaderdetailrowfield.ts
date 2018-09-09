import {Component, Input} from '@angular/core';

@Component({
    selector: '[object-page-header-detail-row-field]',
    templateUrl: './app/objectcomponents/templates/objectpageheaderdetailrowfield.html'
})
export class ObjectPageHeaderDetailRowField{
    @Input() moduleName: any = '';
    @Input() field: any = {};
}