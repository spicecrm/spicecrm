/**
 * @module MailLogModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {relatedmodels} from "../../../services/relatedmodels.service";

/**
 * modal onInit() == setsyncusers profiles are syncronized
 */
@Component({
    selector: 'prospectlists-to-maillog-modal',
    templateUrl: './src/include/maillog/templates/prospectliststomaillogmodal.html',
    providers: [model]
})
export class ProspectListsToMailLogModal {

    private self: any = {};
    public list: any[] = [];

    constructor(
        private language: language,
        private router: Router,
        private metadata: metadata,
        private backend: backend,
        private toast: toast,
        private model: model,
        private relatedModels: relatedmodels,
        private modal: modal,
        private modellist: modellist
    ) {
    }

    public ngOnInit() {
        this.transferToMailLog();
    }

    private close() {
        this.self.destroy();
    }

    private transferToMailLog() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.postRequest('/MailLog/ProspectLists/' + this.model.id).subscribe(result => {
                this.list = result;
                loadingRef.instance.self.destroy();
            });
        });
    }
}
