/**
 * @module ServiceComponentsModule
 */
import {Component, Input, Output,  EventEmitter} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';

/**
 * @deprecated: shoudl no longer be used - moved to actionset
 */
@Component({
    selector: 'service-add-ticket-button',
    templateUrl: '../templates/serviceaddticketbutton.html',
    providers: [model]
})
export class ServiceAddTicketButton {

    @Input() servicecall: any = {};
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public model: model, public language: language) {}

    saveandcreate(){
        this.servicecall.save().subscribe(servicecall => {
            this.click.emit(true);
            this.model.module = 'ServiceTickets';
            this.model.addModel('', this.servicecall);
        })
    }

}
