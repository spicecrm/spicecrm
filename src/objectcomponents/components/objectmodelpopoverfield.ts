import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    templateUrl: './src/objectcomponents/templates/objectmodelpopoverfield.html',
    providers: [view]
})
export class ObjectModelPopoverField {
    public componentconfig: any = {};

    constructor(
        private model: model,
        private view: view
    ) {

    }

    get hidden() {
        return this.componentconfig.hideempty && !this.model.getFieldValue(this.componentconfig.field);
    }

    get fieldname() {
        return this.componentconfig.field ? this.componentconfig.field : '';
    }
}
