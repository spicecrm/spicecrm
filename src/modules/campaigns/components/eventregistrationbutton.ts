/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'event-registration-button',
    templateUrl: '../templates/eventregistrationbutton.html'
})
export class EventRegistrationButton {

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal) {

    }

    public selectedItem: any;

    public subscriptions: Subscription = new Subscription();

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    get module() {
        return this.model.getField('module_name');
    }

    get placeholder() {
        // return default placeholder
        return this.module ? this.language.getModuleCombinedLabel('LBL_SEARCH', this.module) : this.language.getLabel('LBL_SEARCH');
    }

    public execute() {
        this.modal.openModal('EventRegistrationModal', true, this.injector);
    }


}
