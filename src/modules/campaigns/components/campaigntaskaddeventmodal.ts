/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'campaigntask-add-event-modal',
    templateUrl: '../templates/campaigntaskaddeventmodal.html'
})
export class CampaignTaskAddEventModal {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public self: any;


    public save() {
        if(this.model.validate()) {
            this.model.save().subscribe(() => {
                this.self.destroy();
            });
        }
    }

    public close() {
        this.self.destroy();
    }
}
