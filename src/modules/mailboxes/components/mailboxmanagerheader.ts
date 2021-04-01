/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/mailboxes/templates/mailboxmanagerheader.html',
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
        private language: language,
        private mailboxesEmails: mailboxesEmails,
        private metadata: metadata,
        private navigationtab: navigationtab,
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
