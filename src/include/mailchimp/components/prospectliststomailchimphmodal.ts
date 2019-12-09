/**
 * @module MailChimpModule
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
    selector: 'prospectlists-to-mailchimp-modal',
    templateUrl: './src/include/mailchimp/templates/prospectliststomailchimpmodal.html'
})
export class ProspectListsToMailChimpModal {

    private self: any = {};
    public statistics: any[] = [];
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

    private initialize() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.getRequest(`MailChimp/${this.model.module}/${this.model.id}/initialize`).subscribe(result => {
                this.statistics = result;
                window.console.log(this.statistics);
                loadingRef.instance.self.destroy();
            });
        });
    }

    private transferToMailChimp() {
        this.backend.postRequest(`MailChimp/${this.model.module}/${this.model.id}/transferToMailChimp`).subscribe(result => {
            if (result.status == 'success') {
                this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                this.close();
            } else {
                this.toast.sendToast(result.msg, 'error');
            }
        });

    }

    private close() {
        this.self.destroy();
    }

    public ngOnInit() {
        this.initialize();
    }

}
