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
 * @module ModuleMailboxes
 */
import {
    Component,
    Input,
    OnInit
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {language} from "../../../services/language.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    providers: [model, view],
    selector: "mailbox-manager-textmessage",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanagertextmessage.html",
})
export class MailboxManagerTextMessage implements OnInit {

    /**
     * the textmessage
     */
    @Input() private message: any = {};

    /**
     * the fieldset for the additonal fields
     */
    private fieldset: string;

    constructor(
        private metadata: metadata,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private view: view,
        private model: model,
        private modelutilities: modelutilities,
    ) {
        // nolinks
        this.view.displayLinks = false;

        // no labels
        this.view.displayLabels = false;

        // get the module conf
        this.fieldset = this.metadata.getComponentConfig("MailboxManagerTextMessage").fieldset;
    }

    /**
     * initilizes the model
     */
    public ngOnInit() {
        this.model.module = "TextMessages";
        this.model.id = this.message.id;
        this.model.data = this.modelutilities.backendModel2spice("TextMessages", this.message);
    }

    /**
     * when an textmessage is selected
     *
     * @param e
     */
    private selectTextmessage(message) {
        if (!this.mailboxesEmails.activeMessage || message.id != this.mailboxesEmails.activeMessage.id) {
            this.mailboxesEmails.activeMessage = message;
        }
    }

    /**
     * helper to get the selected message and highlight accordingly
     */
    get isSelected() {
        return this.mailboxesEmails.activeMessage && this.mailboxesEmails.activeMessage.id == this.model.id;
    }

    /**
     * style the name
     */
    get nameStyle() {
        let style = {};
        if (this.message.status === 'unread') {
            style['font-weight'] = 'bold';
        }
        switch (this.message.openness) {
            case 'user_closed':
            case 'system_closed':
                style['text-decoration'] = 'line-through';
                break;
        }
        return style;
    }
}
