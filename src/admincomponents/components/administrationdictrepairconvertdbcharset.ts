/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'administration-dict-repair-convert-db-charset',
    templateUrl: '../templates/administrationdictrepairconvertdbcharset.html'
})

export class AdministrationDictRepairConvertDBCharset {

    constructor(public modal: modal, public injector: Injector) {
    }

    /**
     * open the convert modal
     */
    public openModal() {
        this.modal.openModal('AdministrationDictRepairConvertDBCharsetModal', true, this.injector);
    }
}
