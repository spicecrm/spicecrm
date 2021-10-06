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
    templateUrl: './src/modules/campaigns/templates/campaigntaskaddbutton.html'
})
export class CampaignTaskAddButton {

    constructor(private language: language, private model: model, private injector: Injector, private modal: modal) {

    }

    public execute() {
        this.modal.openModal('CampaignTaskAddModal', true, this.injector);
    }


}
