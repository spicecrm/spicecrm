/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {result} from "underscore";


@Component({
    selector: 'administration-dict-repair',
    templateUrl: '../templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {


    constructor(public backend: backend, public toast: toast, public modal: modal, public injector: Injector) {
    }


    /**
     * calls the backend repair method that delivers the sql string, injects it in the modal
     */
    public repairDB() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest('admin/repair/sql').subscribe(result => {
            loadingModal.emit(true);
            let sql = result.sql;
            let wholeSQL = result.wholeSQL;
            if(result) {
                this.modal.openModal('AdministrationDictRepairModal', true, this.injector).subscribe(modal => {
                    modal.instance.sql = sql;
                    modal.instance.wholeSQL = wholeSQL;
                });
            }
        });
    }

    public repairDBColumns() {
        this.modal.openModal('AdministrationDictRepairDbColumnsModal', true, this.injector);
    }


    public repairDBCache() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest('admin/repair/cachedb').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast('LBL_CACHE_REPAIRED', 'success');
            } else {
                this.toast.sendToast('LBL_ERROR', 'error');
            }
        });
    }

    /**
     * open the convert modal
     */
    public convertCharset() {
        this.modal.openModal('AdministrationDictRepairConvertDBCharsetModal', true, this.injector);
    }

    /**
     * repair custom enum
     */
    public repairCustomENUMs() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.postRequest('admin/repair/custom/enum').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast('LBL_CACHE_REPAIRED', 'success');
            } else {
                this.toast.sendToast('LBL_ERROR', 'error');
            }
        });
    }

    public repairResetExternalCache() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.deleteRequest('system/cache').subscribe(result => {
            loadingModal.emit(true);
            if(result) {
                this.toast.sendToast('LBL_CACHE_RESET', 'success');
            } else {
                this.toast.sendToast('LBL_ERROR', 'error');
            }
        });
    }

    /**
     * initiates a pull from the repo and updates the code
     *
     */
    public pullFromRepository(){
        this.modal.openModal('AdministrationDictRepairGitPullModal', true, this.injector);
    }

}
