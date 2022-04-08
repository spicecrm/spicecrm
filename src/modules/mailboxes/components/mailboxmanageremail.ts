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
    selector: "mailbox-manager-email",
    templateUrl: "../templates/mailboxmanageremail.html",
})
export class MailboxManagerEmail implements OnInit {

    /**
     * the email record
     */
    @Input() public email: any = {};

    /**
     * the fieldset for the additonal fields
     */
    public fieldset: string;

    constructor(
        public metadata: metadata,
        public language: language,
        public mailboxesEmails: mailboxesEmails,
        public view: view,
        public model: model,
        public modelutilities: modelutilities
    ) {
        // no links
        this.view.displayLinks = false;

        // no label
        this.view.displayLabels = false;

        // get the module conf
        this.fieldset = this.metadata.getComponentConfig("MailboxManagerEmail").fieldset;
    }

    /**
     * intiializes and sets the model
     */
    public ngOnInit() {
        this.model.module = "Emails";
        this.model.id = this.email.id;
        this.model.setData(this.email);
    }

    /**
     * emits when an email is selected
     * @param e
     */
    public selectMail(e) {
        if (!this.mailboxesEmails.activeMessage || e.id != this.mailboxesEmails.activeMessage.id) {
            this.mailboxesEmails.activeMessage = e;
        }
    }

    /**
     * a getter to highlight the selected email
     */
    get isSelected() {
        return this.mailboxesEmails.activeMessage && this.mailboxesEmails.activeMessage.id == this.model.id;
    }

    /**
     * get the styles for the email subject field
     */
    get nameStyle() {
        let style = {};
        if (this.email.status === 'unread') {
            style['font-weight'] = 'bold';
        }
        switch (this.email.openness) {
            case 'user_closed':
            case 'system_closed':
                style['text-decoration'] = 'line-through';
                break;
        }
        return style;
    }
}
