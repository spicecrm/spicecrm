/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {configurationService} from "../../services/configuration.service";

/**
 * the central dictionary Manager
 */
@Component({
    selector: 'dictionary-manager',
    templateUrl: '../templates/dictionarymanager.html',
    providers: [dictionarymanager]
})
export class DictionaryManager {

    constructor(public dictionarymanager: dictionarymanager,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public injector: Injector,
                private configurationService: configurationService) {

    }

    public migrate(){
        this.modal.openModal('DictionaryManagerMigrateDefinitionModal', true, this.injector);
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

    public repairDBCache() {
        this.modal.confirm('are you sure you want to rebuild the dictionary data cache?', 'rebuild dictionary Cache').subscribe({
            next: (res) => {
                if(res) {
                    let loadingModal = this.modal.await('LBL_LOADING');
                    this.backend.getRequest('admin/repair/cachedb').subscribe(result => {
                        loadingModal.emit(true);
                        if (result) {
                            this.toast.sendToast('LBL_CACHE_REPAIRED', 'success');
                            this.configurationService.reloadTaskData('fielddefs');
                        } else {
                            this.toast.sendToast('LBL_ERROR', 'error');
                        }
                    });
                }
            }
        })
    }

    /**
     * open the convert modal
     */
    public convertCharset() {
        this.modal.openModal('AdministrationDictRepairConvertDBCharsetModal', true, this.injector);
    }

    public repairDBColumns() {
        this.modal.openModal('AdministrationDictRepairDbColumnsModal', true, this.injector);
    }



}
