/**
 * @module ModuleMailboxes
 */
import {
    Component,
    Input,
    ElementRef,
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

    @Input() private message: any = {};
    private componentFields: any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private elementref: ElementRef,
        private view: view,
        private model: model,
        private modelutilities: modelutilities,
    ) {
        this.view.displayLinks = false;
    }

    public ngOnInit() {
        this.model.module = "TextMessages";
        this.model.id = this.message.id;
        this.model.data = this.modelutilities.backendModel2spice("TextMessages", this.message);

        // get the module conf
        let fieldset = this.metadata.getComponentConfig("MailboxManagerTextMessage").fieldset;
        if (fieldset) {
            this.componentFields = this.metadata.getFieldSetItems(fieldset);
        }
    }

    private selectMail(e) {
        if (!this.mailboxesEmails.activeMessage || e.id != this.mailboxesEmails.activeMessage.id) {
            this.mailboxesEmails.activeMessage = e;
        }
    }

    get isSelected() {
        return this.mailboxesEmails.activeMessage && this.mailboxesEmails.activeMessage.id == this.model.id;
    }

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
