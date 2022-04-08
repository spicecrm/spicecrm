/**
 * @module EvalancheModule
 */

import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";

declare var _: any;

@Component({
    selector: 'sendinblue-modal',
    templateUrl: '../templates/sendinbluemodal.html'
})
export class SendinBlueModal {

    public contacts: any = [];
    public self: any = {};

    constructor(
        public language: language,
        public router: Router,
        public metadata: metadata,
        public backend: backend,
        public model: model,
        public modal: modal,
        public toast: toast
    ) {
    }


    /**
     * calls the backend route to update the target list on Sendinblue
     * @private
     */
    public updateSendInBlueList() {
        const extId = this.model.getFieldValue('ext_id');
        if (_.isEmpty(extId)) {
            this.toast.sendToast(this.language.getLabel('MSG_NO_EXT_ID'), 'error');
            this.close();
        } else {
            this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
                loadingRef.instance.messagelabel = 'LBL_UPDATING';
                this.backend.postRequest(`channels/emarketing/sendinblue/${this.model.module}/${this.model.id}/${extId}`, {}).subscribe(result => {
                    if (result) {
                        loadingRef.instance.self.destroy();
                        this.close();
                        this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    }
                });
            });
        }
    }

    /**
     * destroys modal instance
     */

    public close() {
        this.self.destroy();
    }

}
