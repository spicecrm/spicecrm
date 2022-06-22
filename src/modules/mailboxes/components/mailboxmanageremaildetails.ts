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
    templateUrl: "../templates/mailboxmanageremaildetails.html",
})
export class MailboxmanagerEmailDetails implements OnDestroy {

    /**
     * the reference to the content container
     */
    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) public detailscontent: ViewContainerRef;

    /**
     * the components rendered in the container
     */
    public containerComponents: any[] = [];

    /**
     * the fieldset for further details
     */
    public fieldset: string = '';

    /**
     * keep the subscription and unsubscribe when the component is destroyed
     */
    public mailboxSubscription: any;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public mailboxesEmails: mailboxesEmails,
        public backend: backend,
        public toast: toast,
        public view: view,
        public modal: modal,
        public injector: Injector
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
    public loadEmail(email) {

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
    public destroyContainer() {
        for (let containerComponent of this.containerComponents) {
            containerComponent.destroy();
        }
        this.containerComponents = [];
    }

    public handleAction(event) {
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
    public buildContainer() {

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
    public completeMail() {
        this.setOpenness('user_closed');
    }

    /**
     * marks the email as unread
     */
    public markUnread() {
        this.setStatus('unread');
    }

    /**
     * reopens a closed email
     */
    public reopen() {
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
        this.backend.postRequest('module/' + this.model.module + '/' + this.model.id + '/status', null, {status: status}).subscribe(
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
        this.backend.postRequest("module/" + this.model.module + '/' + this.model.id + "/openness", null, {openness: openness}).subscribe(
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
     * reply to all recipients of the email
     * inject mode as true to set it to replyall
     *
     * @private
     */
    public replyToAll() {
        this.modal.openModal('EmailReplyModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.mode = 'replyall';
        });
    }

    /**
     * reply to the email
     *
     * @private
     */
    public reply() {
        this.modal.openModal('EmailReplyModal', true, this.injector);
    }

    /**
     * forward the email
     *
     * @private
     */
    public forward() {
        this.modal.openModal('EmailForwardModal', true, this.injector);
    }

    /**
     * delete the email
     *
     * @private
     */
    public delete() {
        this.model.delete();
    }

    /**
     * set the active message to null
     */
    public goBack() {
        this.mailboxesEmails.activeMessage = null;
    }
}
