/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'service-myqueues-tickets-dashlet-item',
    templateUrl: '../templates/servicemyqueuesticketsdashletitem.html',
    providers: [model, view]
})
export class ServiceMyQueuesTicketsDashletItem implements OnInit {

    @Input() ticket;
    headerfieldset: string = '';
    detailfieldset: string = '';

    constructor(public language: language, public metadata: metadata, public model: model, public modelutilities: modelutilities) {
        this.model.module = 'ServiceTickets';
        let componentconfig = this.metadata.getComponentConfig('ServiceMyQueuesTicketsDashletItem');
        this.headerfieldset = componentconfig.headerfieldset;
        this.detailfieldset = componentconfig.detailfieldset;

    }

    ngOnInit() {
        this.model.id = this.ticket.id;
        this.model.data = this.modelutilities.backendModel2spice('ServiceTickets', this.ticket);
    }

}
