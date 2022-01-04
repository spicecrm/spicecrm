/**
 * @module ModuleMailboxes
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {mailboxesEmails} from '../services/mailboxesemail.service';
import {ActivatedRoute} from '@angular/router';
import {InputRadioOptionI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";

@Component({
    selector: 'mailbox-manager-header',
    templateUrl: '../templates/mailboxmanagerheader.html',
})
export class MailboxManagerHeader implements OnInit {

    public splitTypeOptions: InputRadioOptionI[] = [
        {value: 'noSplit', icon: 'picklist_type', title: 'LBL_NO_SPLIT'},
        {value: 'verticalSplit', icon: 'side_list', title: 'LBL_VERTICAL_SPLIT'},
        {value: 'horizontalSplit', icon: 'inspector_panel', title: 'LBL_HORIZONTAL_SPLIT'},
    ];

    /**
     * the selected mailbox
     */
    public _mailbox: string;

    /**
     * indicates that emaisl are being fetched in the background
     */
    public isFetching: boolean = false;

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
        public language: language,
        public mailboxesEmails: mailboxesEmails,
        public metadata: metadata,
        public navigationtab: navigationtab,
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
        if(this.navigationtab.activeRoute.params.id) {
            // catch an event from mailboxesEmails service once the mailboxes are actually loaded
            this.mailboxesEmails.mailboxesLoaded$.subscribe(
                (loaded) => {
                    if (loaded === true) {
                        this.mailbox = this.navigationtab.activeRoute.params.id;
                    }
                }
            );
        }
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

            this.navigationtab.setTabInfo({displayname: this.mailboxesEmails.activeMailBox.name, displaymodule:'Mailboxes'});
        } else {
            this.mailboxesEmails.activeMailBox = {};
        }
    }

    /**
     * reloads the emails list
     */
    public reloadList() {
        this.mailboxesEmails.loadMessages();
    }

    /**
     * fetches emails in teh backend
     */
    public fetchEmails() {
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

    /**
     * set the active split type
     * @param type
     */
    public setActiveSplitType(type: 'verticalSplit' | 'horizontalSplit' | 'noSplit') {
        const activeType: any = {name: type};
        switch (type) {
            case'noSplit':
                this.mailboxesEmails.activeMessage = null;
                activeType.icon = 'picklist_type';
                activeType.label = 'LBL_NO_SPLIT';
                break;
            case'verticalSplit':
                activeType.icon = 'side_list';
                activeType.label = 'LBL_VERTICAL_SPLIT';
                break;
            case'horizontalSplit':
                activeType.icon = 'inspector_panel';
                activeType.label = 'LBL_HORIZONTAL_SPLIT';
                break;
        }
        this.mailboxesEmails.activeSplitType = activeType;
    }
}
