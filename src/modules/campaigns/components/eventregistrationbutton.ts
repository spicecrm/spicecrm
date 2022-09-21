/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'event-registration-button',
    templateUrl: '../templates/eventregistrationbutton.html'
})
export class EventRegistrationButton {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public execute() {
        this.modal.openModal('EventRegistrationModal', true, this.injector);
    }


}
