/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

@Component({
    templateUrl: '../templates/serviceticketview.html'

})
export class ServiceTicketView implements OnInit {

    public componentconfig: any = {};

    constructor(public metadata: metadata, public model: model, public elementRef: ElementRef) {

    }

    public ngOnInit() {

        // this.componentconfig = this.metadata.getComponentConfig('ServiceTicketView', this.model.module);
    }
}
