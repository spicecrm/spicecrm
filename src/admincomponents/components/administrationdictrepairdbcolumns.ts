/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {AdministrationDictRepairDbColumnsModal} from "./administrationdictrepairdbcolumnsmodal";

@Component({
    selector: 'administration-dict-repair-db-columns',
    templateUrl: '../templates/administrationdictrepairdbcolumns.html'
})

export class AdministrationDictRepairDbColumns {
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal, public injector: Injector) {
    }

    public executeRepairDbColumns() {
        this.modal.openModal('AdministrationDictRepairDbColumnsModal', true, this.injector);
    }
}
