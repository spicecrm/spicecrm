import {Component, ComponentRef} from '@angular/core';
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'user-alias-manager-modal',
    templateUrl: '../templates/useraliasmanagermodal.html',
    providers: [relatedmodels]
})

export class UserAliasManagerModal implements ModalComponentI {
    /**
     * reference of this component
     */
    public self: ComponentRef<this>;

    constructor(private backend: backend,
                private model: model,
                private toast: toast,
                public relatedModels: relatedmodels,
                private modal: modal) {
        this.getAllAliases();
    }

    /**
     * get all aliases
     * @private
     */
    private getAllAliases() {
        this.relatedModels.module = 'Users';
        this.relatedModels.relatedModule = 'UserAliases';
        this.relatedModels.id = this.model.id;
        this.relatedModels.loaditems = 500;
        this.relatedModels.getData();
    }

    /**
     * create a new alias
     */
    public create() {
        this.modal.input('LBL_ALIAS', 'LBL_NEW').subscribe(answer => {

            if (!answer) return;

            const isLoading = this.modal.await('LBL_PROCESSING');
            const data = {id: this.model.generateGuid(),
                user_id: this.model.id,
                alias_name: answer
            };

            this.backend.save('UserAliases', data.id, data).subscribe({
                next: alias => {
                    isLoading.next(true);
                    isLoading.complete();
                    this.toast.sendToast('LBL_SAVED', 'success');
                    this.relatedModels.items.push(alias);
                },
                error: () => {
                    isLoading.next(true);
                    isLoading.complete();
                    this.toast.sendToast('LBL_ALIAS_EXIST', 'error');
                    this.create();
                }
            });
        });
    }

    /**
     * toggle activate alias
     * @param alias
     */
    public toggleActivate(alias) {
        alias.status = alias.status == 'Active' ? 'Inactive' : 'Active';

        this.backend.save('UserAliases', alias.id, {status: alias.status}).subscribe({
            error: () => {
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }

    /**
     * delete an alias
     * @param id
     */
    public delete(id: string) {
        this.modal.confirmDeleteRecord().subscribe(answer => {
            if (!answer) return;
            const isLoading = this.modal.await('LBL_PROCESSING');

            this.backend.deleteRequest(`module/UserAliases/${id}`).subscribe({
                next: () => {
                    this.toast.sendToast('LBL_SUCCESS', 'success');
                    this.relatedModels.items = this.relatedModels.items.filter(a => a.id != id);

                    isLoading.next(true);
                    isLoading.complete();
                },
                error: () => {
                    isLoading.next(true);
                    isLoading.complete();
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            });
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}