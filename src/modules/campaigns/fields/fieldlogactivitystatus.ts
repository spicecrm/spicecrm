/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {fieldEnum} from "../../../objectfields/components/fieldenum";
import {modal} from "../../../services/modal.service";

/**
 * renders a status field for the participation status
 */
@Component({
    selector: 'field-log-activity_status',
    templateUrl: '../templates/fieldlogactivitystatus.html'
})
export class fieldLogActivityStatus extends fieldEnum  {

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public injector: Injector,
                public modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    public showDetails(){
        this.modal.openModal('CampaignLogTrackingActionsModal', true, this.injector);
    }

}
