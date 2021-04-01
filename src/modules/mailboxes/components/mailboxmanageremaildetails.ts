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
 * @module ModuleMailboxes
 */
import {
    Component,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    Injector
} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";
import {toast} from "../../../services/toast.service";

/**
 * renders the details panel for an emailor textmessage in teh mailbox manager
 */
@Component({
    providers: [model, view],
    selector: "mailbox-manager-email-details",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanageremaildetails.html",
})
export class MailboxmanagerEmailDetails implements OnDestroy {

    /**
     * the reference to the content container
     */
    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) private detailscontent: ViewContainerRef;

    /**
     * the components rendered in the container
     */
    private containerComponents: any[] = [];

    /**
     * the fieldset for further details
     */
    private fieldset: string = '';

    /**
     * keep the subscription and unsubscribe when the component is destroyed
     */
    private mailboxSubscription: any;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private mailboxesEmails: mailboxesEmails,
        private backend: backend,
        private toast: toast,
        private view: view,
        private modal: modal,
        private injector: Injector
    ) {
        // subscribe to the event when a message is selected
        this.mailboxSubscription = this.mailboxesEmails.activeMessage$.subscribe(email => {
            this.loadEmail(email);
        });

        /**
         * no labels in teh view
         */
        this.view.displayLabels = false;
    }

    /**
     * unsubscribe from teh service
     */
    public ngOnDestroy(): void {
        this.mailboxSubscription.unsubscribe();
    }

    /**
     * load the email
     *
     * @param email
     */
    private loadEmail(email) {

        // set the module to the model
        if (this.mailboxesEmails.activeMailBox) {
            if (this.mailboxesEmails.activeMailBox.type == 'sms') {
                this.model.module = "TextMessages";
            } else if (this.mailboxesEmails.activeMailBox.type == 'email') {
                this.model.module = "Emails";
            }
        }

        // initialize and set the id
        this.model.initialize();

        // on load undefined is returned
        if (!email) {
            this.model.id = undefined;
            return;
        }

        this.model.id = email.id;

        // rebuild the container so all data gets reinitialized
        this.buildContainer();

        // load the model
        this.model.getData(false, '').subscribe(loaded => {
            if (this.model.getFieldValue('status') == 'unread') {
                this.setStatus('read');
            }
        });
    }

    /**
     * destroy the container
     */
    private destroyContainer() {
        for (let containerComponent of this.containerComponents) {
            containerComponent.destroy();
        }
        this.containerComponents = [];
    }

    private handleAction(event) {
        switch (event) {
            // is needed for the emailtoobject component and its behavior to link a relation after save so it needs to reloaded in order to show new related records...
            case 'save':
                this.buildContainer();
                break;
        }
    }

    /**
     * builds the container, destroying all prev components and then rendering the new ones
     */
    private buildContainer() {

        this.destroyContainer();

        // get componentset
        let componentconfig = this.metadata.getComponentConfig("MailboxmanagerEmailDetails", this.model.module);
        let viewComponentSet = this.mailboxesEmails.activeSplitType.name == 'horizontalSplit' ? componentconfig.horizontalComponentset : componentconfig.componentset;
        for (let component of this.metadata.getComponentSetObjects(viewComponentSet)) {
            this.metadata.addComponent(component.component, this.detailscontent).subscribe(componentRef => {
                componentRef.instance.componentconfig = component.componentconfig ? component.componentconfig : {};
                this.containerComponents.push(componentRef);
            });
        }

        // load the fieldset
        this.fieldset = componentconfig.fieldset;
    }

    /**
     * indicates if closed by the user
     */
    get isUserClosed() {
        return this.model.getField('openness') == 'user_closed';
    }

    /**
     * set if read
     */
    get isRead() {
        return this.model.getField('status') == 'read';
    }

    /**
     * returns the actionset for the mailbox
     */
    get actionSet() {
        if (this.mailboxesEmails.activeMailBox.actionset) {
            return this.mailboxesEmails.activeMailBox.actionset;
        } else {
            return "";
        }
    }

    /**
     * set the email to closed
     */
    private completeMail() {
        this.setOpenness('user_closed');
    }

    /**
     * marks the email as unread
     */
    private markUnread() {
        this.setStatus('unread');
    }

    /**
     * reopens a closed email
     */
    private reopen() {
        this.setOpenness('open');
    }

    /**
     * set a specific status to the email
     * @param status
     */
    public setStatus(status) {
        // set the model
        this.model.setField('status', status);
        // update the backend
        this.backend.postRequest('module/' + this.model.module + '/' + this.model.id + '/setstatus/' + status).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeMessage.status = status;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change status to ' + status);
            }
        );
    }

    /**
     * set a specific openness value
     *
     * @param openness
     */
    public setOpenness(openness) {
        // set the model
        this.model.setField("openness", openness);
        // update the backend
        this.backend.postRequest("module/" + this.model.module + '/' + this.model.id + "/setopenness/" + openness).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeMessage.openness = openness;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change openness to ' + openness);
            }
        );
    }

    /**
     * reply to the email
     *
     * @private
     */
    private reply() {
        this.modal.openModal('EmailReplyModal', true, this.injector);
    }

    /**
     * forward the email
     *
     * @private
     */
    private forward() {
        this.modal.openModal('EmailForwardModal', true, this.injector);
    }

    /**
     * delete the email
     *
     * @private
     */
    private delete() {
        this.model.delete();
    }

    /**
     * set the active message to null
     */
    public goBack() {
        this.mailboxesEmails.activeMessage = null;
    }
}
