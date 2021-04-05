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
 * @module ModuleEmails
 */

import {Component, EventEmitter, Output, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

/**
 * this renders a button as part of an actionset that renders a reply button to create an email reply modal
 */
@Component({
    selector: "email-reply-button",
    templateUrl: "./src/modules/emails/templates/emailreplybutton.html"
})
export class EmailReplyButton {
    /**
     * set as part when the acitonset renders
     *
     * @private
     */
    public actionconfig;

    constructor(
        private injector: Injector,
        private model: model,
        private metadata: metadata,
        private modal: modal,
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if it is allowed for the user to create an email
     */
    get disabled() {
        // check ACL if we can create an email
        if (!this.metadata.checkModuleAcl('Emails', 'create')) return true;

        return false;
    }


    /**
     * the method invoed when selecting the action. This triggers opening a modal window for the email composition
     */
    public execute() {
        this.modal.openModal('EmailReplyModal', true, this.injector);
    }


}
