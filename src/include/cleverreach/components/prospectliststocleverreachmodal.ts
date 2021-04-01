/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/include/cleverreach/templates/prospectliststocleverreachmodal.html'
})
export class ProspectListsToCleverReachModal implements OnInit {

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

    /**
     * loads modal first
     * loads statistics from backend
     * once completed the modal destroys itself
     */

    private initialize() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            this.backend.getRequest(`CleverReach/${this.model.module}/${this.model.id}/initialize`).subscribe(result => {
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

    private transferToCleverReach() {
        this.backend.postRequest(`CleverReach/${this.model.module}/${this.model.id}/transferToCleverReach`).subscribe(result => {
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

    private close() {
        this.self.destroy();
    }

    /**
     * once the app has started initialize() is fired
     */

    public ngOnInit() {
        this.initialize();
    }

}
