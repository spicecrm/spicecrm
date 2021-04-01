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
 * @module WorkbenchModule
 */
import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {backend} from "../../services/backend.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modellist} from "../../services/modellist.service";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";

/**
 * part of the workbench to manage the mailboxes
 */
@Component({
    providers: [modellist, model, view],
    selector: "mailboxes-manager",
    templateUrl: "./src/workbench/templates/mailboxesmanager.html",
})
export class MailboxesManager {

    /**
     * the container with the view .. gets rendered daynamically
     */
    @ViewChild("viewcontainer", {read: ViewContainerRef, static: true}) private viewcontainer: ViewContainerRef;

    /**
     * the currently selected mailbox id
     */
    private _selected_mailbox;

    /**
     * any component reference that is rendered
     */
    private renderedview: any[] = [];

    /**
     * the actionset to be rendered in the header
     */
    private headeractionset: string;

    constructor(
        private modellist: modellist,
        private backend: backend,
        private footer: footer,
        private language: language,
        private metadata: metadata,
        private model: model,
        private modelutils: modelutilities,
        private modelutilities: modelutilities,
        private toast: toast,
        private view: view,
        private configuration: configurationService
    ) {
        this.modellist.module = 'Mailboxes';

        this.model.module = "Mailboxes";
        this.view.isEditable = true;

        // get the transports
        if (!this.configuration.getData('mailboxtransports')) {
            this.configuration.setData('mailboxtransports', []);
            this.backend.getRequest('mailboxes/transports').subscribe(transports => {
                this.configuration.setData('mailboxtransports', transports);
            });
        }

        let componentconfig = this.metadata.getComponentConfig('MailboxesManager', 'Mailboxes');
        this.headeractionset = componentconfig.actionset;
    }

    /**
     * getter for the mailboxes returning them sorted
     */
    get mailboxes() {
        return this.modellist.listData.list.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * getter for the current mailbox
     */
    get selected_mailbox() {
        return this.model.id;
    }

    /**
     * setter for the current mailbox that also triggert the rerendering and the load of the model
     *
     * @param mailbox
     */
    set selected_mailbox(mailbox) {
        let thismailbox = this.modellist.listData.list.find(mb => mb.id == mailbox);
        if (thismailbox) {
            // set the current mailbox and go load the model
            this._selected_mailbox = mailbox;
            this.model.id = mailbox;
            this.model.getData();

            // render new
            this.cleanView();
            this.renderedview = [];
            this.metadata.addComponent('ObjectRecordDetails', this.viewcontainer).subscribe(component => {
                this.renderedview.push(component);
            });
            this.metadata.addComponent('ObjectRelateContainer', this.viewcontainer).subscribe(component => {
                this.renderedview.push(component);
            });
        } else {
            this.cleanView();
            this._selected_mailbox = null;
            this.model.id = "";
            this.model.initialize();
        }
    }

    /**
     * cleans the current view
     */
    private cleanView() {
        // destroy what we have rendered thus far
        for (let thisview of this.renderedview) {
            thisview.destroy();
        }

    }

    /**
     * resets the view and removes all currently rendered components
     */
    private reset() {
        this.view.setViewMode();
        this.model.reset();
        this.model.module = "Mailboxes";
    }

    /**
     *
     */
    private setAsDefault() {
        this.backend.getRequest("mailboxes/setdefaultmailbox", {mailbox_id: this.model.data.id})
            .subscribe(
                (res) => {
                    this.toast.sendToast(res);
                    this.model.setField("is_default", true);
                },
                (err) => {
                    console.log(err);
                },
            );
    }
}
