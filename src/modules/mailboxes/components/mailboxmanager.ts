import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {Subject} from "rxjs";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {navigation} from "../../../services/navigation.service";
import {mailboxesEmails} from "../services/mailboxesemail.service";

@Component({
    providers: [mailboxesEmails],
    selector: 'mailbox-manager',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanager.html',
})
export class MailboxManager {
    @ViewChild('mailboxdetail', {read: ViewContainerRef}) private mailboxdetail: ViewContainerRef;

    @Input() private email: any = {};

    private loadedMailbox: string;
    private start: number = 0;
    private limit: number = 25;

    private emailList: any[] = [];
    private selectedEmail: any;

    constructor(
        private navigation: navigation,
        private backend: backend,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
    ) {
        this.navigation.setActiveModule('Mailboxes');
    }

}
