/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    templateUrl: "./src/modules/users/templates/userdeactivatebutton.html"
})

/**
 * an actionset button to deactivate a user or activate the user again
 */
export class UserDeactivateButton {

    constructor(private language: language, private modal: modal, private model: model, private session: session, private injector: Injector, private backend: backend, private toast: toast) {
    }

    /**
     * only allow active subscribers and not the admin to be disabled
     */
    get disabled() {
        return this.session.isAdmin && this.model.id != '1' ? false : true;
    }

    /**
     * execute the action
     */
    private execute() {
        if (this.model.getField('status') == 'Active') {
            this.modal.openModal("UserDeactivateModal", true, this.injector);
        } else {
            this.modal.prompt('confirm', this.language.getLabel('MSG_ACTIVATE_USER', '', 'long'), this.language.getLabel('MSG_ACTIVATE_USER')).subscribe(
                res => {
                    if (res) {
                        let spinner = this.modal.await(this.language.getLabel('LBL_ACTIVATING'));
                        this.backend.postRequest(`module/Users/${this.model.id}/activate`).subscribe(
                            res => {
                                this.model.getData();
                                spinner.emit(true);
                            },
                            err => {
                                spinner.emit(true);
                                this.toast.sendToast('an Error occured deactivating the User', 'error');
                            }
                        );
                    }
                }
            );
        }
    }

    /**
     * get the action label
     */
    get actionLabel() {
        return this.model.getField('status') == 'Active' ? 'LBL_DEACTIVATE' : 'LBL_ACTIVATE';
    }
}
