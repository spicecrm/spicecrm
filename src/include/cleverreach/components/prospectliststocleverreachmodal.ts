/**
 * @module CleverReachModule
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
    selector: 'prospectlists-to-cleverreach-modal',
    templateUrl: '../templates/prospectliststocleverreachmodal.html'
})
export class ProspectListsToCleverReachModal implements OnInit {

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

    /**
     * loads modal first
     * loads statistics from backend
     * once completed the modal destroys itself
     */

    public initialize() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.getRequest(`channels/emarketing/cleverreach/${this.model.module}/${this.model.id}/initialize`).subscribe(result => {
                this.statistics = result;
                loadingRef.instance.self.destroy();
            });
        }, error => console.log(error));
    }

    /**
     * post request synchronizes contacts with cleverreach
     * upon success router navigates back to the module view
     * else an error message is sent
     */

    public transferToCleverReach() {
        this.backend.postRequest(`channels/emarketing/cleverreach/${this.model.module}/${this.model.id}/transfer`).subscribe(result => {
            if (result.status == 'success') {
                this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                this.close();
            } else {
                this.toast.sendToast(result.msg, 'error');
            }
        });

    }

    /**
     * modal instance self destroys when clicking the close button
     */

    public close() {
        this.self.destroy();
    }

    /**
     * once the app has started initialize() is fired
     */

    public ngOnInit() {
        this.initialize();
    }

}
