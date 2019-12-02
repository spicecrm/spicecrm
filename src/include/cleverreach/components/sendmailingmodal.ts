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
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    selector: 'send-mailing-modal',
    templateUrl: './src/include/cleverreach/templates/sendmailingmodal.html'
})
export class SendMailingModal {

    private self: any = {};
    private module: string = '';
    private mailing = new FormGroup({
        name: new FormControl(''),
        subject: new FormControl(''),
        html: new FormControl(''),
    });

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

    private onSubmit() {
        this.backend.postRequest(`CleverReach/${this.model.module}/${this.model.id}/sendMailing`, null, this.mailing.value).subscribe(
            (success) => {
                this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'));
            },
            (error) => {
                this.toast.sendAlert(this.language.getLabel('LBL_ERROR'));
                console.error(error);
            }
        );

    }

    private close() {
        this.self.destroy();
    }


}
