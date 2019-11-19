/**
 * @module MailLogModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';

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
        private model: model,
        private modal: modal
    ) {
        window.console.log(this.model.id);
    }

    private transferToMailLog() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.postRequest(`MailLog/ProspectLists/d3dc01c9-2367-e1b0-b3b6-5dd4016f3942/transferToMailLog`).subscribe(result => {
                this.list = result;
                window.console.log(result);
                loadingRef.instance.self.destroy();
            });
        });
    }

    public ngOnInit() {
        this.transferToMailLog();
    }

    private close() {
        this.self.destroy();
    }

}
