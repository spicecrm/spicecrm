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
    templateUrl: './src/admincomponents/templates/administrationdictrepairitem.html'
})
export class AdministrationDictRepairItem {

    private sql: any = [];
    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal, private injector: Injector) {
    }

    /**
     * calls the backend repair method that delivers the sql string, injects it in the modal
     */
    public executeDB() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('/repair/sql').subscribe(result => {
            await.emit(true);
            this.sql = result.sql;
            if(result) {
                this.modal.openModal('AdministrationDictRepairModal', true, this.injector).subscribe(modal => {
                    modal.instance.sql = this.sql;
                });
            }
        });
        }


}
