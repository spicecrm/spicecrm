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

@Component({
    templateUrl: '../templates/evalanchemailingmodal.html'
})
export class EvalancheMailingModal {

    public self: any = {};
    public templates: any = [];
    public name: string = "";
    public template: string = "";
    public targetlists: any = [];
    public subjectline: string = "";
    public loading: boolean = false;


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


    public submit() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            const selected = this.targetlists.filter(list => list.selected).map(list => list.id);
            let body = {
                name: this.name,
                subjectline: this.subjectline,
                template: this.template,
                targetlists: selected
            };

            this.backend.postRequest(`channels/emarketing/evalanche/${this.model.module}/${this.model.id}/sendmailing`, {}, body).subscribe(response => {
                loadingRef.instance.self.destroy();
                if (response.success) {
                    this.toast.sendToast('success', 'success');
                    this.close();
                } else {
                    this.toast.sendToast('error', 'error');
                }
            });
        });
    }

    public close() {
        this.self.destroy();
    }


}
