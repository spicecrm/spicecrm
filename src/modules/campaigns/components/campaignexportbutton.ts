/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'campaign-export-button',
    templateUrl: '../templates/campaignexportbutton.html'
})
export class CampaignExportButton {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public execute() {
        this.modal.openModal('CampaignExportModal', true, this.injector);
    }


}
