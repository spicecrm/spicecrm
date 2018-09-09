import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    OnInit
} from "@angular/core";
import {Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {language} from "../../../services/language.service";
import {navigation} from "../../../services/navigation.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    providers: [model, view],
    selector: "mailbox-manager-email",
    templateUrl: "./src/modules/mailboxes/templates/mailboxmanageremail.html",
})
export class MailboxManagerEmail implements OnInit {

    @Input() email: any = {}
    componentFields: Array<any> = [];

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
        this.model.module = "Emails";
        this.model.id = this.email.id;
        this.model.data = this.modelutilities.backendModel2spice("Emails", this.email);

        // get the module conf
        let fieldset = this.metadata.getComponentConfig("MailboxManagerEmail").fieldset;
        if (fieldset) {
            this.componentFields = this.metadata.getFieldSetFields(fieldset);
        }
    }

    private selectMail(e) {
        if (!this.mailboxesEmails.activeEmail || e.id != this.mailboxesEmails.activeEmail.id)
            this.mailboxesEmails.activeEmail = e;
    }

    get isSelected() {
        return this.mailboxesEmails.activeEmail && this.mailboxesEmails.activeEmail.id == this.model.id;
    }

    get nameStyle() {
        let style = {};
        if (this.email.status === 'unread') {
            style['font-weight'] = 'bold'
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
