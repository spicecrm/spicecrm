/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketview.html'

})
export class ServiceTicketView implements OnInit {

    private componentconfig: any = {};

    constructor(private metadata: metadata, private model: model, private elementRef: ElementRef) {

    }

    public ngOnInit() {

        // this.componentconfig = this.metadata.getComponentConfig('ServiceTicketView', this.model.module);
    }
}