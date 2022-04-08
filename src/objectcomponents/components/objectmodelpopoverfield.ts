/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    templateUrl: '../templates/objectmodelpopoverfield.html',
    providers: [view]
})
export class ObjectModelPopoverField {
    public componentconfig: any = {};

    constructor(
        public model: model,
        public view: view
    ) {

    }

    get hidden() {
        return this.componentconfig.hideempty && !this.model.getFieldValue(this.componentconfig.field);
    }

    get fieldname() {
        return this.componentconfig.field ? this.componentconfig.field : '';
    }
}
