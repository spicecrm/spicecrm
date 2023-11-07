import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'sendgrid-delete-from-targetlist-button',
    templateUrl: '../templates/sendgridremovecontactfromtargetlistbutton.html',

})

export class SendgridRemoveContactFromTargetListButton {
    constructor(
        public model: model,
        public language: language,
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public relatedmodels: relatedmodels,
        public metadata: metadata
    ) {
    }


    /**
     * gets the disabled state for the import button based on the acl rights for the user
     */

    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'sendgrid_remove');
    }

    /**
     * fires rest call from backend to Sendgrid
     */
    public execute() {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD')
            .subscribe(answer => {
                if (answer) {
                    this.relatedmodels.deleteItem(this.model.id);
                    let awaitModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
                    this.backend.deleteRequest(`channels/emarketing/sendgrid/marketing/lists/${this.model.id}/contacts/${this.relatedmodels.id}`).subscribe(
                        response => {
                            awaitModal.emit(true);
                            if (response) {
                                this.toast.sendToast('LBL_SUCCESS', 'success');
                            } else {
                                this.toast.sendToast('LBL_ERROR', 'error');
                            }
                        }
                    );

                }
            });

    }


}


