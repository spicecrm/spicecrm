/**
 * @module ModuleMailboxes
 */
import {Injectable, EventEmitter, Output, OnDestroy} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';

import {Subject, Observable, BehaviorSubject, Subscription} from 'rxjs';

/**
 * @ignore
 */
declare var moment: any;

@Injectable()
export class mailboxesEmails implements OnDestroy {

    @Output('mailboxesLoaded') public mailboxesLoaded$: BehaviorSubject<boolean>;

    /**
     * holds the mailbox manager active split type
     */
    public activeSplitType: {
        name: 'noSplit' | 'verticalSplit' | 'horizontalSplit',
        icon: 'picklist_type' | 'side_list' | 'inspector_panel',
        label: 'LBL_NO_SPLIT' | 'LBL_VERTICAL_SPLIT' | 'LBL_HORIZONTAL_SPLIT'
    } = {name: 'noSplit', icon: 'picklist_type', label: 'LBL_NO_SPLIT'};

    /**
     * the default limit for the emails to be loaded at once
     */
    public limit = 50;

    /**
     * the list of mailboxes
     */
    public mailboxes: any[] = [];

    /**
     * the list of emails
     */
    public emails: any[] = [];

    /**
     * the total number of emails
     */
    public totalcount: number = 0;

    /**
     * the source of the query
     */
    public source: string = 'fts';

    /**
     * the active mailbox object
     */
    public _activeMailBox: any;

    /**
     * eht active email object
     */
    public _activeMessage: any;

    /**
     * an event emitter when the active email selected is changed
     */
    public activeMessage$: EventEmitter<any> = new EventEmitter<any>();

    /**
     * bound to the checkbox for unread only
     */
    public _unreadonly: boolean = true;

    /**
     * a boolean indicator that the emails are loading
     */
    public isLoading: boolean = false;

    /**
     * the value for the "openness" of an email
     */
    public emailopenness: string = "";

    /**
     * holds teh subscriptions for the sevrice
     *
     * @private
     */
    public serviceSubscriptions: Subscription = new Subscription();

    /**
     * holds the search term
     */
    public searchTerm: string;

    constructor(
        public backend: backend,
        public broadcast: broadcast
    ) {
        this.mailboxesLoaded$ = new BehaviorSubject<boolean>(false);

        // load the mailboxes
        this.getMailboxes();

        // subscribe to the broadcast service
        this.serviceSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    /**
     * unsubscribe to all subscriptions of the service
     */
    public ngOnDestroy() {
        this.serviceSubscriptions.unsubscribe();
    }

    /**
     * gets the active message so this can be highlighted properly
     */
    get activeMessage() {
        return this._activeMessage;
    }

    /**
     * setter when a message is selected also emits the message so the other view can react
     * @param email
     */
    set activeMessage(email) {
        this._activeMessage = email;
        this.activeMessage$.emit(email);
    }

    /**
     * getter for the selcted mailbox
     */
    get activeMailBox() {
        return this._activeMailBox;
    }

    /**
     * setter for the active inbox
     * @param mailbox
     */
    set activeMailBox(mailbox) {
        this._activeMailBox = mailbox;
        this.emails = [];
        this.totalcount = 0;
    }

    /**
     * getter for unread only
     */
    get unreadonly() {
        return this._unreadonly;
    }

    /**
     * setter for unread only that also loads the list fresh
     *
     * @param value
     */
    set unreadonly(value) {
        this._unreadonly = value;
        this.loadMessages();
    }

    public getMailboxes() {

        this.backend.getRequest("module/Mailboxes/scope", {scope: 'inbound'}).subscribe(
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
                this.mailboxesLoaded$.next(true);
            }
        );

    }

    /**
     * handles model updates
     *
     * @param message
     */
    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== 'Emails') {
            return;
        }

        switch (message.messagetype) {
            case 'model.delete':
                let deletedItemIndex = this.emails.findIndex(item => item.id == message.messagedata.id);
                if (deletedItemIndex >= 0) {
                    if(this.activeMessage.id == message.messagedata.id){
                        this.activeMessage = undefined;
                    }

                    this.emails.splice(deletedItemIndex, 1);
                    this.totalcount--;

                }
                break;
            case 'model.save':
                let eventHandled = false;
                let savedItemIndex = this.emails.findIndex(item => item.id == message.messagedata.id);
                if (savedItemIndex >= 0) {
                    this.emails[savedItemIndex] = message.messagedata.data;
                }
                break;
        }
    }

    /**
     * fetches new emails on the backend
     */
    public fetchEmails() {
        let responseSubject = new Subject<any>();

        this.backend.getRequest("module/Mailboxes/" + this.activeMailBox.id + "/fetchemails").subscribe(
            // todo a spinner or sth similar while waiting for the response
            (response: any) => {
                if (response.new_mail_count > 0) {
                    this.loadMessages();
                }
                responseSubject.next({status: 'success', newmailcount: response.new_mail_count});
                responseSubject.complete();
            },
            error => {
                responseSubject.error({status: 'error', error});
                responseSubject.complete();
            }
        );
        return responseSubject.asObservable();
    }

    /**
     * generates the filters for the query
     */
    public generateFilters() {
        let filter = {
            logicaloperator: 'and',
            groupscope: 'all',
            conditions: [{
                field: "mailbox_id",
                filtervalue: this.activeMailBox.id,
                operator: "equals"
            }]
        };
        if (this.activeMailBox.type == 'sms') {
            filter.conditions.push({
                field: "direction",
                filtervalue: 'i',
                operator: "equals"
            });
        } else {
            filter.conditions.push({
                field: "type",
                filtervalue: "inbound",
                operator: "equals"
            });

            if (this.emailopenness) {
                filter.conditions.push({
                    field: "openness",
                    filtervalue: this.emailopenness,
                    operator: "equals"
                });
            }
            if (this.unreadonly) {
                filter.conditions.push({
                    field: "status",
                    filtervalue: "unread",
                    operator: "equals"
                });
            }
        }
        return filter;
    }

    /**
     * returns the endpoint depending if we look for Textmessages or for Emails
     */
    get endpoint() {
        return this.activeMailBox.type == 'sms' ? 'module/TextMessages' : 'module/Emails';
    }

    /**
     * returns an array of requested fields depending if we look for Textmessages or for Emails
     */
    get requestFields() {
        return this.activeMailBox.type == 'sms' ? ["name", "id", "msisdn_e164", "date_sent", "description"] : ["name", "id", "from_addr_name", "date_sent", "status", "openness", "sentiment", "magnitude"];
    }

    /**
     * loads the messages
     */
    public loadMessages() {
        if (!this.activeMailBox || (this.activeMailBox && !this.activeMailBox.id)) {
            return false;
        }

        // set no message selected
        this.activeMessage = undefined;

        // reset the emails
        this.emails = [];

        let krestRoute = 'module/Emails';
        let conditions = [
            {field: "mailbox_id", operator: "=", value: this.activeMailBox.id},
        ];

        let parameters = {
            filter: this.generateFilters(),
            sortfields: [{
                sortdirection: "DESC",
                sortfield: "date_sent"
            }],
            fields: JSON.stringify(this.requestFields),
            limit: this.limit,
            searchterm: this.searchTerm
        };

        this.isLoading = true;

        this.backend.getRequest(this.endpoint, parameters).subscribe((res: any) => {
            // set the emails
            this.emails = res.list;

            // set the source
            this.source = res.source;

            // set the totalcount
            this.totalcount = res.totalcount;

            // this.loadedMailbox = this.activeMailBox.id;
            this.isLoading = false;
        });
    }

    /**
     * load more
     */
    public loadMore() {
        // check if we can load more
        // not if we are loading or if the count of emails exceeds the totalcount
        if (this.isLoading || this.emails.length >= this.totalcount) {
            return false;
        }

        // set to laoding
        this.isLoading = true;

        // build paramaters
        let parameters = {
            fields: JSON.stringify(this.requestFields),
            filter: this.generateFilters(),
            limit: this.limit,
            offset: this.emails.length,
            sortfields: [{
                sortdirection: "DESC",
                sortfield: "date_sent"
            }]
        };

        // make the backend request
        this.backend.getRequest(this.endpoint, parameters).subscribe((res: any) => {
            if (res.list.length > 0) {

                // add the emails
                this.emails = this.emails.concat(res.list);

                // set the source
                this.source = res.source;

                // set the totalcount
                this.totalcount = res.totalcount;
            }
            this.isLoading = false;
        });
    }
}
