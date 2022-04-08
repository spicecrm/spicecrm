/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaigntask-add-button',
    templateUrl: '../templates/campaigntaskaddbutton.html'
})
export class CampaignTaskAddButton {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public execute() {
        this.modal.openModal('CampaignTaskAddModal', true, this.injector);
    }


}
