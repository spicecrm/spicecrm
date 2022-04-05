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

    templateUrl: '../templates/serviceticketclosebutton.html'
})
export class ServiceTicketCloseButton {

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
        let resolveDate = this.model.getField('resolve_until');
        if(resolveDate && resolveDate.isBefore(new moment())) {
            this.modal.openModal('ServiceTicketCloseModal', true, this.injector);
        } else {
            this.model.startEdit(true);
            this.model.setField('serviceticket_status', this.item.status_to);
            if (this.model.validate()) {
                this.model.save();
            } else {
                this.model.edit();
            }
        }

    }

}
