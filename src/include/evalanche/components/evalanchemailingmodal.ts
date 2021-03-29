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
    templateUrl: './src/include/evalanche/templates/evalanchemailingmodal.html'
})
export class EvalancheMailingModal {

    private self: any = {};
    private templates: any = [];
    private name: string = "";
    private template: string = "";
    private targetlists: any = [];
    private subjectline: string = "";
    private loading: boolean = false;


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


    private submit() {
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

    private close() {
        this.self.destroy();
    }


}
