/**
 * @module ModuleDeployment
 */
import {Component, ComponentRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";

/**
 * modal to display target system packages
 */
@Component({
    selector: 'deployment-system-packages-modal',
    templateUrl: '../templates/deploymentsystempackagesmodal.html',
})
export class DeploymentSystemPackagesModal {
    /**
     * holds the loaded packages
     */
    public packages: { id: string, name: string, selected?: boolean }[] = [];
    /**
     * disabled if no packages selected
     */
    public disabled: boolean = true;
    /**
     * holds the parent system id
     */
    public parentId: string;
    /**
     * hold a reference of this component
     */
    public self: ComponentRef<DeploymentSystemPackagesModal>;

    constructor(public model: model,
                public backend: backend,
                public modal: modal,
                public toast: toast) {
    }

    /**
     * set import disabled
     */
    public setDisabled() {
        this.disabled = this.packages.filter(p => p.selected).length == 0;
    }

    /**
     * import selected packages change requests content
     */
    public import() {

        const processing = this.modal.await('LBL_IMPORTING');
        const body = {packages: this.packages.filter(p => p.selected).map(p => p.id)};

        this.backend.postRequest(`configuration/deployment/system/${this.parentId}/packages/${this.model.id}`, null, body).subscribe({
            next: res => {

                if (!res.success) {
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                } else {
                    this.toast.sendToast('LBL_IMPORTED', 'success');
                    this.close();
                }

                processing.next(true);
                processing.complete();
            }, error: () => {
                processing.next(false);
                processing.complete();
            }
        });
    }

    /**
     * destroy modal
     */
    public close() {
        this.self.destroy();
    }
}
