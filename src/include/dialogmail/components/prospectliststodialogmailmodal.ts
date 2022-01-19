/**
 * @module DialogMailModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'prospectlists-to-dialogmail-modal',
    templateUrl: '../templates/prospectliststodialogmailmodal.html'
})
export class ProspectListsToDialogMailModal {

    public self: any = {};
    public statistics: any = [];
    public module: string = '';

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

    public initialize() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.getRequest(`channels/emarketing/dialogmail/${this.model.module}/${this.model.id}/initialize`).subscribe(result => {
                this.statistics = result;
                loadingRef.instance.self.destroy();
            });
        });
    }

    public transferToDialogMail() {
        this.backend.postRequest(`channels/emarketing/dialogmail/${this.model.module}/${this.model.id}/transfer`).subscribe(result => {
            if (result.status == 'success') {
                this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                this.close();
            } else {
                this.toast.sendToast(result.msg, 'error');
            }
        });

    }

    public close() {
        this.self.destroy();
    }

    public ngOnInit() {
        this.initialize();
    }


}
