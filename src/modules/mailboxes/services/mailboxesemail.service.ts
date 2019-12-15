/**
 * @module ModuleMailboxes
 */
import {Injectable, EventEmitter, Output} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

import {Subject, Observable} from 'rxjs';


/**
* @ignore
*/
declare var moment: any;

@Injectable()
export class mailboxesEmails {

    @Output('mailboxesLoaded') mailboxesLoaded$: EventEmitter<boolean> = new EventEmitter<boolean>();

    private limit = 30;

    public mailboxes: any[] = [];
    public emails: any[] = [];

    private _activeMailBox: any;
    private _activeMessage: any;
    public activeMessage$: EventEmitter<any> = new EventEmitter<any>();
    public unreadonly: boolean = true;
    public openonly: boolean = true;
    public isLoading: boolean = false;
    public emailopenness: string = "";
    public allLoaded: boolean = false;

    constructor(
        private backend: backend,
        private modelutilities: modelutilities,
    ) {
        this.getMailboxes();
    }

    get activeMessage() {
        return this._activeMessage;
    }

    set activeMessage(email) {
        this._activeMessage = email;
        this.activeMessage$.emit(email);
    }

    get activeMailBox() {
        return this._activeMailBox;
    }

    set activeMailBox(mailbox) {
        this._activeMailBox = mailbox;
        this.allLoaded = false;
    }

    private getMailboxes() {

        this.backend.getRequest("mailboxes/getmailboxes", {scope: 'inbound'}).subscribe(
            (results: any) => {
                for (let mailbox of results) {
                    this.mailboxes.push({
                        actionset: mailbox.actionset,
                        id: mailbox.value,
                        name: mailbox.display,
                        type: mailbox.type,
                    });
                }
                // send an event here and catch it in mailboxmanagerheader
                this.mailboxesLoaded$.emit(true);
            }
        );

    }

    public fetchEmails() {
        let responseSubject = new Subject<boolean>();

        this.backend.getRequest("/modules/Mailboxes/" + this.activeMailBox.id + "/fetchemails").subscribe(
            // todo a spinner or sth similar while waiting for the response
            (response: any) => {
                if (response.new_mail_count > 0) {
                    this.loadMessages();
                }
                responseSubject.next(response);
                responseSubject.complete();
            },
        );
    }

    public loadMessages() {
        if (!this.activeMailBox) {
            return false;
        }

        this.activeMessage = undefined;

        // reset the emails
        this.emails = [];

        let krestRoute = 'module/Emails';
        let conditions = [
            {field: "mailbox_id", operator: "=", value: this.activeMailBox.id},
        ];

        let parameters = {
            searchfields: {},
            sortdirection: "DESC",
            sortfield: "date_sent",
            fields: '',
        };

        if (this.activeMailBox.type == 'sms') {
            krestRoute = 'module/TextMessages';
            conditions.push({
                field: "direction",
                value: 'i',
                operator: "="
            });

            parameters.fields = JSON.stringify(["name", "id", "msisdn_e164", "date_sent", "description"]);
        } else {
            conditions.push({
                field: "type",
                value: "inbound",
                operator: "="
            });

            if (this.emailopenness) {
                conditions.push({
                    field: "openness",
                    value: this.emailopenness,
                    operator: "="
                });
            }
            if (this.unreadonly) {
                conditions.push({
                    field: "status",
                    value: "unread",
                    operator: "="
                });
            }

            parameters.fields = JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness",
                    "sentiment", "magnitude"]);
        }

        parameters.searchfields =
            JSON.stringify({
                conditions: conditions,
                join: "and",
            });


        this.isLoading = true;

        this.backend.getRequest(krestRoute, parameters).subscribe((res: any) => {
            this.emails = res.list;
            // this.loadedMailbox = this.activeMailBox.id;
            this.isLoading = false;
        });
    }

    public loadMore() {
        this.isLoading = true;
        let parameters = {};
        if (this.unreadonly) {
            parameters = {
                fields: JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness",
                "sentiment", "magnitude"]),
                limit: this.limit,
                offset: this.emails.length,
                searchfields: JSON.stringify({
                        conditions: [
                            {
                                field: "mailbox_id",
                                operator: "=",
                                value: this.activeMailBox.id,
                            },
                            {field: "status", value: "user_closed", operator: "!="},
                            {field: "type", value: "inbound", operator: "="}
                        ],
                        join: "and",
                    }
                ),
                sortdirection: "DESC",
                sortfield: "date_sent",
            };
        } else {
            parameters = {
                fields: JSON.stringify(["name", "id", "from_addr_name", "date_sent", "status", "openness"]),
                limit: this.limit,
                offset: this.emails.length,
                searchfields: JSON.stringify({
                    conditions: [
                        {
                            field: "mailbox_id",
                            value: this.activeMailBox.id,
                            operator: "="
                        },
                        {field: "type", value: "inbound", operator: "="}
                    ],
                    join: "and",
                }),
                sortdirection: "DESC",
                sortfield: "date_sent",
            };
        }


        this.backend.getRequest("module/Emails", parameters).subscribe((res: any) => {
            if (res.list.length > 0) {
                for (let mail of res.list) {
                    this.emails.push(mail);
                }
            } else {
                this.allLoaded = true;
            }

            this.isLoading = false;
        });
    }
}
