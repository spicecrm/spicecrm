/**
 * @module ServiceComponentsModule
 */
import {Component, Input, Output, EventEmitter, SkipSelf} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'service-add-ticket-action-button',
    templateUrl: '../templates/serviceaddticketactionbutton.html',
    providers: [model]
})
export class ServiceAddTicketActionButton {

    public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, @SkipSelf() public servicecall: model, public model: model, public language: language) {}

    public execute(){
        this.servicecall.save().subscribe(servicecall => {
            this.model.module = 'ServiceTickets';
            this.model.addModel('', this.servicecall);
            this.actionemitter.emit(true);
        });
    }

}
