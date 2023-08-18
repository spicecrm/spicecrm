/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, OnInit, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';

declare var moment: any;

@Component({

    templateUrl: '../templates/serviceticketassigntobutton.html'
})
export class ServiceTicketAssignToButton {

    /**
     * the status network item record
     */
    public item: any;

    public hidden = false;
    public disabled = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector
    ) {

    }

    public execute() {
        this.modal.openModal('ServiceTicketAssignToModal', true, this.injector).subscribe(assignModal => {
            assignModal.instance.serviceticket_status = this.item.status_to;
        });
    }

}
