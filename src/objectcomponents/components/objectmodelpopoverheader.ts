/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-model-popover-header',
    templateUrl: './src/objectcomponents/templates/objectmodelpopoverheader.html',
})
export class ObjectModelPopoverHeader {

    constructor(private model: model) {}

}
