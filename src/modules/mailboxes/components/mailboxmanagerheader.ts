import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {mailboxesEmails} from '../services/mailboxesemail.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'mailbox-manager-header',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanagerheader.html',
})
export class MailboxManagerHeader implements OnInit {

    private mailboxselection: string;
    private emailopenness: string = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private metadata: metadata
    ) {

        // load default settings for the openness selection and the unread only flag
        let componentconfig = this.metadata.getComponentConfig('MailboxManagerHeader');
        this.emailopenness = componentconfig.selectionstatus ? componentconfig.selectionstatus : '';
        this.mailboxesEmails.unreadonly = componentconfig.unreadonly ? componentconfig.unreadonly : false;
    }

    public ngOnInit() {
        let routeSubscribe = this.activatedRoute.params.subscribe(
            (params) => {
                this.mailboxselection = params['id'];

                // catch an event from mailboxesEmails service once the mailboxes are actually loaded
                this.mailboxesEmails.mailboxesLoaded$.subscribe(
                    (loaded) => {
                        if (loaded === true) {
                            this.selectMailbox();
                        }
                    }
                );
            }
        );
    }

    private selectMailbox() {
        this.mailboxesEmails.activeMailBox = {};
        for (let mailbox of this.mailboxesEmails.mailboxes) {
            if (mailbox.id === this.mailboxselection) {
                this.mailboxesEmails.activeMailBox = mailbox;
            }
        }
        this.mailboxesEmails.loadMails();
    }

    private selectEmailOpenness() {
        this.mailboxesEmails.emailopenness = this.emailopenness == "all" ? "" : this.emailopenness;
        this.mailboxesEmails.loadMails();
    }

    get buttonenabled() {
        return this.mailboxesEmails.activeMailBox && !this.mailboxesEmails.isLoading ? true : false;
    }

    private reloadList() {
        this.mailboxesEmails.loadMails();
    }

    private fetchEmails() {
        this.mailboxesEmails.fetchEmails();
    }

}
