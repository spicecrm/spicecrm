/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-item',
    templateUrl: '../templates/administrationdictrepairitem.html'
})
export class AdministrationDictRepairItem {
    /**
     * array container for the statements
     * @private
     */
    public sql: any = [];
    /**
     * whole untouched sql string
     * @private
     */
    public wholeSQL: string;
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal, public injector: Injector) {
    }

    /**
     * calls the backend repair method that delivers the sql string, injects it in the modal
     */
    public executeDB() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('admin/repair/sql').subscribe(result => {
            loadingModal.emit(true);
            this.sql = result.sql;
            this.wholeSQL = result.wholeSQL;
            if(result) {
                this.modal.openModal('AdministrationDictRepairModal', true, this.injector).subscribe(modal => {
                    modal.instance.sql = this.sql;
                    modal.instance.wholeSQL = this.wholeSQL;
                });
            }
        });
        }


}
