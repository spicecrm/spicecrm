/**
 * @module CleverReachModule
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
    selector: 'send-mailing-modal',
    templateUrl: './src/include/cleverreach/templates/sendmailingmodal.html'
})
export class SendMailingModal {

    private self: any = {};
    private module: string = '';

    constructor(
        private language: language,
        private router: Router,
        private metadata: metadata,
        private backend: backend,
        private model: model,
        private modal: modal,
        private toast: toast
    ) {
    }

    private writeMailing() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.getRequest(`CleverReach/${this.model.module}/${this.model.id}/initialize`).subscribe(result => {

            });
        });
    }

    private close() {
        this.self.destroy();
    }

}
