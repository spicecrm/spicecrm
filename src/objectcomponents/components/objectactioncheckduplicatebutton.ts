import {Component, OnInit, SkipSelf} from '@angular/core';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";

@Component({
    selector: 'object-action-check-duplicate-button',
    templateUrl: '../templates/objectactioncheckduplicatebutton.html',
    providers: [model]
})

export class ObjectActionCheckDuplicateButton implements OnInit {

    /**
     * if set to true display the button as icon
     */
    public displayasicon: boolean = false;

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
     * 
     */
    get deleteCheck(): boolean {
        const acceptedItemFound =  this.relatedmodels.acceptedDuplicates.find(item => item.id == this.model.id);
        if(acceptedItemFound) {
            return this._deleteCheck = true;
        } else {
            return this._deleteCheck = false;
        }
    }
    /**
     * sets the Bean as checked duplicate in the sysacceptedduplicates table
     */
    public execute() {
        this.inProcess = true;
        let loadingModal = this.modal.await(this.language.getLabel('LBL_SAVING_DATA'));

        this.backend.postRequest(`module/${this.parentmodel.module}/${this.parentmodel.id}/${this.model.id}/acceptasduplicate`, {deleted: this._deleteCheck}).subscribe({
            next: (resp) => {

                if(!this._deleteCheck) {

                    this.relatedmodels.acceptedDuplicates.push(resp.acceptedDuplicate.rightBean);

                    this.relatedmodels.count--;

                    // reload list
                    this.broadcast.broadcastMessage('duplicates.reload', {
                        newAcceptedDuplicate: resp.acceptedDuplicate.rightBean
                    });

                    this.inProcess = false;
                    loadingModal.emit(true);
                    this.toast.sendToast(this.language.getLabel('LBL_DUPLICATE_CHECKED'), 'success');
                } else {
                    // remove the checked duplicate Bean from acceptedDuplicates
                    this.relatedmodels.acceptedDuplicates = this.relatedmodels.acceptedDuplicates.filter(item => item.id != resp.acceptedDuplicate.rightBean.id);

                    this.relatedmodels.count++;

                    this.broadcast.broadcastMessage('duplicates.reload', {
                        deletedAcceptedDuplicate: resp.acceptedDuplicate.rightBean
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
    }

}