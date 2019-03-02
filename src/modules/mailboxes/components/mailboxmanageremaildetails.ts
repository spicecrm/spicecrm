/**
 * @module ModuleMailboxes
 */
import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";
import {toast} from "../../../services/toast.service";

@Component({
    providers: [model, view],
    selector: "mailbox-manager-email-details",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanageremaildetails.html",
})
export class MailboxmanagerEmailDetails implements AfterViewInit {

    private containerComponents: Array<any> = [];

    @ViewChild("detailscontent", {read: ViewContainerRef}) private detailscontent: ViewContainerRef;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        public sanitizer: DomSanitizer,
        private mailboxesEmails: mailboxesEmails,
        private elementref: ElementRef,
        private backend: backend,
        private toast: toast,
    ) {
        // set the module to the model
        this.model.module = 'Emails';

        mailboxesEmails.activeEmail$.subscribe(email => {
            this.loadEmail(email);
        });

    }

    get containerStyle() {
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)'
        }
    }

    loadEmail(email) {

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

    public ngAfterViewInit() {
        // this.buildContainer();
    }

    destroyContainer() {
        for (let containerComponent of this.containerComponents) {
            containerComponent.destroy();
        }
        this.containerComponents = [];
    }

    handleAction(event)
    {
        switch(event)
        {
            // is needed for the emailtoobject component and its behavior to link a relation after save so it needs to reloaded in order to show new related records...
            case 'save':
                this.buildContainer();
                break;
        }
    }

    buildContainer() {

        this.destroyContainer();

        // get componentset
        let componentconfig = this.metadata.getComponentConfig("MailboxmanagerEmailDetails", this.model.module);
        let viewComponentSet = componentconfig.componentset;
        for (let component of this.metadata.getComponentSetObjects(viewComponentSet)) {
            this.metadata.addComponent(component.component, this.detailscontent).subscribe(componentRef => {
                componentRef.instance["componentconfig"] = component.componentconfig ? component.componentconfig : {};
                this.containerComponents.push(componentRef);
            });
        }
    }

    get sanitizedEmailHtml() {
        return this.sanitizer.bypassSecurityTrustHtml(this.model.data.body);
    }

    get nameStyle() {
        let styles = {};

        if (this.isCompleted) {
            styles["text-decoration"] = "line-through";
        }

        return styles;
    }

    get isUserClosed() {
        return this.model.getField('openness') == 'user_closed';
    }

    get isRead() {
        return this.model.getField('status') == 'read';
    }

    get isCompleted() {
        return this.model.data.emailopenness === "user_closed";
    }

    get actionSet() {
        if (this.mailboxesEmails.activeMailBox.actionset) {
            return this.mailboxesEmails.activeMailBox.actionset;
        } else {
            return "";
        }
    }

    private completeMail() {
        this.setOpenness('user_closed');
    }

    private markUnread() {
        this.setStatus('unread');
    }

    private reopen() {
        this.setOpenness('open');
    }

    public setStatus(status) {
        // set the model
        this.model.setField('status', status);
        // update the backend
        this.backend.postRequest('/module/Emails/' + this.model.id + '/setstatus/' + status).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeEmail.status = status;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change status to ' + status);
            }
        );
    }

    public setOpenness(openness) {
        // set the model
        this.model.setField("openness", openness);
        // update the backend
        this.backend.postRequest("/module/Emails/" + this.model.id + "/setopenness/" + openness).subscribe(
            (res: any) => {
                // also set it in the service
                this.mailboxesEmails.activeEmail.openness = openness;
            },
            (err: any) => {
                this.toast.sendAlert('Cannot change openness to ' + openness);
            }
        );
    }
}