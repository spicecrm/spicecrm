/**
 * @module ModuleMailboxes
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {mailboxesEmails} from '../services/mailboxesemail.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'mailbox-manager-header',
    templateUrl: './src/modules/mailboxes/templates/mailboxmanagerheader.html',
})
export class MailboxManagerHeader implements OnInit {

    /**
     * the selected mailbox
     */
    private _mailbox: string;

    /**
     * indicates that emaisl are being fetched in the background
     */
    private isFetching: boolean = false;

    /**
     * a getter for the openness
     */
    get emailopenness() {
        return this.mailboxesEmails.emailopenness == "" ? 'all' : this.mailboxesEmails.emailopenness;
    }

    /**
     * a setter for the openness that also triggers the relaod
     *
     * @param val
     */
    set emailopenness(val) {
        this.mailboxesEmails.emailopenness = val == 'all' ? "" : val;
        this.mailboxesEmails.loadMessages();
    }

    /**
     * general if the buttons on top are enabled
     */
    get buttonenabled() {
        return this.mailboxesEmails.activeMailBox && !this.mailboxesEmails.isLoading && !this.isFetching ? true : false;
    }


    constructor(
        private activatedRoute: ActivatedRoute,
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private metadata: metadata
    ) {

        // load default settings for the openness selection and the unread only flag
        let componentconfig = this.metadata.getComponentConfig('MailboxManagerHeader');

        // set the default open setting
        this.emailopenness = componentconfig.selectionstatus ? componentconfig.selectionstatus : '';

        // set teh default unread status
        this.mailboxesEmails.unreadonly = componentconfig.unreadonly ? componentconfig.unreadonly : false;
    }

    /**
     * initialize
     */
    public ngOnInit() {
        let routeSubscribe = this.activatedRoute.params.subscribe(
            (params) => {
                this.mailbox = params.id;

                // catch an event from mailboxesEmails service once the mailboxes are actually loaded
                this.mailboxesEmails.mailboxesLoaded$.subscribe(
                    (loaded) => {
                        if (loaded === true) {
                            this.mailbox = params.id;
                        }
                    }
                );
            }
        );
    }

    /**
     * a simple getter for the mailbox
     */
    get mailbox() {
        return this._mailbox;
    }

    /**
     * a setter for the mailbox that also trigers the reload
     *
     * @param mailbox
     */
    set mailbox(mailbox) {
        this._mailbox = mailbox;
        if (mailbox) {
            this.mailboxesEmails.activeMailBox = this.mailboxesEmails.mailboxes.find(mb => mb.id == mailbox);
            this.mailboxesEmails.loadMessages();
        } else {
            this.mailboxesEmails.activeMailBox = {};
        }
    }

    /**
     * reloads the emails list
     */
    private reloadList() {
        this.mailboxesEmails.loadMessages();
    }

    /**
     * fetches emails in teh backend
     */
    private fetchEmails() {
        this.isFetching = true;
        this.mailboxesEmails.fetchEmails().subscribe(
            success => {
                this.isFetching = false;
            },
            error => {
                this.isFetching = false;
            }
        );
    }

}
