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
    selector: 'prospectlists-to-dialogmail-modal',
    templateUrl: './src/include/maillog/templates/prospectliststodialogmailmodal.html'
})
export class ProspectListsToDialogMailModal {

    private self: any = {};
    public list: any[] = [];

    constructor(
        private language: language,
        private router: Router,
        private metadata: metadata,
        private backend: backend,
        private model: model,
        private modal: modal
    ) {}

    private initialize(){
        // get request ...
        // => count total .. count mit dialogmail profil .. count wenn liste existiert mit Änderungen ..
    }

    private transferToDialogMail() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.postRequest(`MailLog/ProspectLists/${this.model.id}/transferToDialogMail`).subscribe(result => {
                this.list = result;
                window.console.log(result);
                loadingRef.instance.self.destroy();
            });
        });
    }

    private close() {
        this.self.destroy();
    }

    public ngOnInit() {
        this.transferToDialogMail();
    }



}
