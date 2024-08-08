import {Component, OnInit, SkipSelf} from '@angular/core';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {duplicatedmodels} from "../../services/duplicatedmodels.service";

@Component({
    selector: 'object-action-check-duplicate-button',
    templateUrl: '../templates/objectactioncheckduplicatebutton.html',
    providers: [model]
})

export class ObjectActionCheckDuplicateButton implements OnInit {

    /**
     * indicator that we are processing currently
     */
    public inProcess: boolean = false;

    /**
     * whether
     */
    public _deleteCheck: boolean = false;

    /**
     * holds config of the action btn
     */
    public actionconfig: any = {};

    constructor(
        public backend: backend,
        @SkipSelf() public model: model,  // bean_id_right
        public parentmodel: model,  // bean_id_left - currently open Bean
        public modal: modal,
        public toast: toast,
        public relatedmodels: relatedmodels,
        private language: language,
        public broadcast: broadcast,
        public duplicatedModels: duplicatedmodels,
    ) {
    }

    ngOnInit() {
        this.parentmodel.module = this.relatedmodels.module;
        this.parentmodel.id = this.relatedmodels.id;
    }

    /**
     * changes the label of the listitemactionset
     */
    get manageLabel(): string {
        return this.deleteCheck ? 'LBL_DELETE_DUPLICATE_CHECK' : 'LBL_CHECK_AS_DUPLICATE';
    }

    /**
     * holds the click value
     */
    get deleteCheck(): boolean {
        return this._deleteCheck;
    }

    /**
     * manages button color class
     */
    get manageBtnClass() {
        const acceptedItemFound = this.duplicatedModels.acceptedDuplicates.find(item => item.id == this.model.id);
        if (acceptedItemFound) {
            this._deleteCheck = true;
            return 'slds-icon-text-success';
        } else {
            this._deleteCheck = false;
            if (this.duplicatedModels.foundDuplicates.find(item => item.id == this.model.id)) return 'slds-icon-text-default';
        }
    }
    /**
     * changes the label of the confirm modal
     */
    get confirmModalLabel(): string {
        return this.deleteCheck ? 'MSG_DELETE_DUPLICATE_CHECK' : 'MSG_ACCEPT_AS_DUPLICATE';
    }

    /**
     * sets the Bean as checked duplicate in the sysacceptedduplicates table
     */
    public execute() {
        this.inProcess = true;
        this.modal.confirm(this.confirmModalLabel, this.confirmModalLabel, 'error').subscribe(answer => {
            if (answer) {
                let loadingModal = this.modal.await(this.language.getLabel('LBL_SAVING_DATA'));
                this.backend.postRequest(`module/${this.parentmodel.module}/${this.parentmodel.id}/${this.model.id}/acceptasduplicate`, {deleted: this._deleteCheck}).subscribe({
                    next: (resp) => {

                        if (!this._deleteCheck) {

                            this.duplicatedModels.acceptedDuplicates.push(resp.checkedDuplicate.rightBean);
                            this.duplicatedModels.foundDuplicates = this.duplicatedModels.foundDuplicates.filter(item => item.id != resp.checkedDuplicate.rightBean.id);

                            // reload list
                            this.broadcast.broadcastMessage('duplicates.reload', {
                                newAcceptedDuplicate: resp.checkedDuplicate.rightBean,
                                status: resp.checkedDuplicate.status
                            });

                            this.inProcess = false;
                            loadingModal.emit(true);
                            this.toast.sendToast(this.language.getLabel('LBL_DUPLICATE_CHECKED'), 'success');
                        } else {
                            // remove the checked duplicate Bean from arrays
                            this.duplicatedModels.acceptedDuplicates = this.duplicatedModels.acceptedDuplicates.filter(item => item.id != resp.checkedDuplicate.rightBean.id);
                            this.duplicatedModels.foundDuplicates = this.duplicatedModels.foundDuplicates.filter(item => item.id != resp.checkedDuplicate.rightBean.id);

                            this.broadcast.broadcastMessage('duplicates.reload', {
                                deletedAcceptedDuplicate: resp.checkedDuplicate.rightBean,
                                status: resp.checkedDuplicate.status
                            });

                            this.inProcess = false;
                            loadingModal.emit(true);
                            this.toast.sendToast(this.language.getLabel('LBL_DUPLICATE_CHECK_DELETED'), 'info');
                        }
                    }, error: () => {
                        this.inProcess = false;
                        loadingModal.emit(true);
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    }
                });
            } else {
                this.inProcess = false;
            }
        });
    }

}