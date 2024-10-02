/**
 * @module ModuleTeleSales
 */
import {Component, Injector} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'field-tele-sales-cockpit-complete',
    templateUrl: '../templates/fieldtelesalescockpitcomplete.html',
    providers: [telecockpitservice]
})
export class FieldTeleSalesCockpitComplete {

    constructor(public model:model,
                public injector: Injector,
                public modal: modal,
                public language: language) {
    }

    get disabled(){
        return !this.model.checkAccess('edit');
    }

    public execute() {
        let item = this.model;
        if (!item) {
            return;
        }
        this.modal.openModal('TeleSalesCockpitCompleteModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.selectedListItem = item;
        });
    }
}
