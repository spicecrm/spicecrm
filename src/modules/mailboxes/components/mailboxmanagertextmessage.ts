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
    templateUrl: "../templates/mailboxmanagertextmessage.html",
})
export class MailboxManagerTextMessage implements OnInit {

    /**
     * the textmessage
     */
    @Input() public message: any = {};

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
        public modelutilities: modelutilities,
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
        this.model.setData(this.message);
    }

    /**
     * when an textmessage is selected
     *
     * @param e
     */
    public selectTextmessage(message) {
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
