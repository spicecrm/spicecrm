/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a component allowing the management of the domaisn in the dictionary defined in the system
 */
@Component({
    selector: 'domain-manager',
    templateUrl: '../templates/domainmanager.html',
    providers: [metadata, domainmanager]
})
export class DomainManager {

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public broadcast: broadcast, public toast: toast, public modal: modal, public injector: Injector) {

    }

    /**
     * save the changes if there are any
     */
    public save() {
        this.domainmanager.save();
    }

    /**
     * repair custom enum
     */
    public repairCustomENUMs() {
        this.modal.confirm('are you sure you want to migrate all old legacy Cache language files', 'migrate Labels').subscribe({
            next: (res) => {
                if(res) {
                    let loadingModal = this.modal.await('LBL_LOADING');
                    this.backend.postRequest('admin/repair/custom/enum').subscribe(result => {
                        loadingModal.emit(true);
                        if (result) {
                            this.toast.sendToast('LBL_CACHE_REPAIRED', 'success');
                        } else {
                            this.toast.sendToast('LBL_ERROR', 'error');
                        }
                    });
                }
            }
        })

    }

}
