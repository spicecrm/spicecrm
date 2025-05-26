/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-model-popover-header',
    templateUrl: '../templates/objectmodelpopoverheader.html',
    standalone: false
})
export class ObjectModelPopoverHeader {

    constructor(public model: model) {}

}
