/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'event-registration-modal-type',
    templateUrl: '../templates/eventregistrationmodaltype.html',
    providers: [view]
})
export class EventRegistrationModalType {

    public fieldset: string;

    constructor(private metadata: metadata, public view: view, public model: model) {
        this.loadComponentConfig();
    }

    public loadComponentConfig() {
        let componentconfig = this.metadata.getComponentConfig('EventRegistrationModalType', 'EventRegistrations');
        this.fieldset = componentconfig.fieldset;
        this.view.isEditable = true;
        this.view.setEditMode();
    }
}
