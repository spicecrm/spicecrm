/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaign-export-button',
    templateUrl: './src/modules/campaigns/templates/campaignexportbutton.html'
})
export class CampaignExportButton {

    constructor(private language: language, private model: model, private injector: Injector, private modal: modal) {

    }

    public execute() {
        this.modal.openModal('CampaignExportModal', true, this.injector);
    }


}
