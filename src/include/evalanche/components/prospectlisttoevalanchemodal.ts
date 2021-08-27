/**
 * @module EvalancheModule
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'prospectlists-to-evalanche-modal',
    templateUrl: './src/include/evalanche/templates/prospectlisttoevalanchemodal.html'
})
export class ProspectListsToEvalancheModal{

    private self: any = {};
    private evalanche: any[] = [];
    private spice: any[] = [];
    private difference: any[] = [];
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

    /**
     * post request synchronizes contacts with evalanche
     */

    private exportToEvalanche() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            let body = {
                prospects: this.difference
            };
            this.backend.postRequest(`/channels/emarketing/evalanche/${this.model.module}/${this.model.id}/sync`, {}, body).subscribe(result => {
                if (result) {
                    loadingRef.instance.self.destroy();
                    this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                    this.close();
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            });
        });
    }

    /**
     * modal instance self destroys when clicking the close button
     */

    private close() {
        this.self.destroy();
    }

}
