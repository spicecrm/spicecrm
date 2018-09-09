/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-record-details-tab-row-field',
    templateUrl: './app/objectcomponents/templates/objectrecorddetailstabrowfield.html'
})
export class ObjectRecordDetailsTabRowField {

    @Input() field: any = {};

    constructor() {

    }
}