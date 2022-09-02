/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaigntask-add-event-button',
    templateUrl: '../templates/campaigntaskaddeventbutton.html'
})
export class CampaignTaskAddEventButton {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public execute() {
        this.modal.openModal('CampaignTaskAddEventModal', true, this.injector);
    }


}
