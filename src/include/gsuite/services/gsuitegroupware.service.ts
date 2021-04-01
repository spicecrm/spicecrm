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
 * @module ModuleGSuite
 */
import {Injectable, OnDestroy} from "@angular/core";
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {Observable, Subject, Subscription} from "rxjs";
import {backend} from "../../../services/backend.service";
import {GSuiteBrokerService} from "./gsuitebroker.service";
import {GSuiteAttachmentI, GSuiteMessageI} from "../interfaces/gsuite.interfaces";
import {Router} from "@angular/router";

declare var _: any;

/**
 * Extension of the groupware service used to communicate with GSuite.
 */
@Injectable()
export class GSuiteGroupware extends GroupwareService implements OnDestroy {
    /**
     * attachment list.
     */
    public attachments: { attachments: GSuiteAttachmentI[] } = {
        attachments: []
    };
    /**
     * the message id
     */
    public threadId: string;
    /**
     * hold subscription for unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(public backend: backend,
                private gSuiteBroker: GSuiteBrokerService,
                private router: Router) {

        super(backend);
        this.subscribeToGSuiteChanges();
    }

    /**
     * get access token
     */
    public getAccessToken() {
        throw new Error("Method not implemented.");
    }

    /**
     * A call to SpiceCRM API to get an email using the thread ID.
     * If an email with this ID is present, it is returned along with a list of linked beans and attachments.
     */
    public getEmailFromSpice(): Observable<any> {

        const retSubject = new Subject();

        this.getThreadId().subscribe(threadId => {

            const data = {thread_id: threadId};

            this.backend.postRequest('module/Emails/groupware/getemail', {}, data).subscribe(
                (res) => {
                    this.emailId = res.email_id;

                    retSubject.next(true);
                    retSubject.complete();
                },
                (err) => {
                    console.error(err);
                    retSubject.error(false);
                    retSubject.complete();
                }
            );
        });

        return retSubject.asObservable();
    }

    /**
     * Loads the email data from GSuite and assembles it into a GroupwareEmail object.
     */
    public assembleEmail(): Observable<any> {

        const response = new Subject<any>();

        this.gSuiteBroker.submitRequest('getEmailMessages').subscribe((res: GSuiteMessageI[]) => {
            response.next(res);
        });
        return response.asObservable();
    }

    /**
     * Load the email attachment data from GSuite including the information about each attachment.
     */
    public getAttachments(): Observable<any> {
        return new Observable<any>();
    }

    /**
     * A call to SpiceCRM API to archive the current email.
     * It also saves the relations to the linked beans and attachments, if any were selected.
     */
    public archiveEmail(): Observable<any> {

        const response = new Subject<any>();


        this.assembleEmail().subscribe((messages: GSuiteMessageI[]) => {

                if (messages.length > 0) {
                    this.isArchiving = true;
                }
                messages.forEach((message: GSuiteMessageI) => {

                    message.body = JSON.parse(message.body);
                    let data = {
                        beans: this.archiveto,
                        email: message,
                    };

                    this.backend.postRequest('module/Emails/groupware/saveGSuiteEmailWithBeans', {}, data).subscribe(
                        (res) => {
                            this.emailId = res.email_id;

                            if (this.archiveattachments.length > 0) {
                                let attachmentData = {
                                    attachments: this.archiveattachments,
                                    email_id: res.email_id,
                                };

                                this.backend.postRequest('module/Emails/groupware/saveGSuiteAttachments', {}, attachmentData).subscribe(
                                    () => {
                                        this.isArchiving = false;
                                        response.next(true);
                                        response.complete();
                                    },
                                    () => {
                                        this.isArchiving = false;
                                        response.error('error archiving attachments');
                                        response.complete();
                                    }
                                );
                            } else {
                                this.isArchiving = false;
                                response.next(true);
                                response.complete();
                            }
                        },
                        () => {
                            this.isArchiving = false;
                            response.error('error archiving email');
                            response.complete();
                        }
                    );
                });
            },
            () => {
                response.error('error assembling email');
                response.complete();
                this.isArchiving = false;
            }
        );

        return response.asObservable();
    }

    /**
     * Returns an array of email adresses used in the selected email.
     */
    public getAddressArray(): Observable<any> {

        const response = new Subject<any>();

        this.gSuiteBroker.submitRequest('getEmailAddresses').subscribe(res => {
            response.next(res);
            response.complete();
        });

        return response.asObservable();
    }

    /**
     * Retrieves an of email adresses and the message ID of the current email.
     */
    public getEmailAddressData(): Observable<any> {
        return new Observable();
    }

    /**
     * get the calendar item id
     */
    public getCalenderItemId(): Observable<string> {
        return new Observable<string>();
    }

    public getCustomProperties(): Observable<any> {
        return new Observable<any>();
    }

    /**
     * Loads the beans from SpiceCRM that are related to any of the email addresses used in the email.
     */
    public loadLinkedBeans(): Observable<any> {

        const response = new Subject<any>();

        this.getAddressArray().subscribe(res => {

            res = res.filter((value, index, self) => self.indexOf(value) === index);
            const body = {addresses: res, thread_id: this.threadId};
            this.relatedBeans = [];

            this.backend.postRequest('EmailAddress/searchBeans', {}, body).subscribe(
                (res: any) => {
                    this.pushRelatedBeans(res);
                    response.next(this.relatedBeans);
                    response.complete();
                },
                (err) => {
                    response.error(err);
                }
            );
        });
        return response.asObservable();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * get thread id from GSuite
     */
    public getThreadId() {
        const response = new Subject<any>();
        this.gSuiteBroker.submitRequest('getThreadId').subscribe(res => {
            response.next(res);
            response.complete();
        });
        return response.asObservable();
    }

    /**
     * subscribe to GSuite changes and reload
     */
    private subscribeToGSuiteChanges() {

        this.subscription = this.gSuiteBroker.gSuiteUpdatesEmitter().subscribe(res => {

            if (!!res.attachment && !this.attachments.attachments.some(a => a.id == res.attachment.id)) {
                res.attachment.content = JSON.parse(res.attachment.content);
                this.attachments.attachments = [...this.attachments.attachments, res.attachment];
                this.archiveattachments.push(res.attachment);
            }

            if (!!res.emailAddresses && res.emailAddresses.length > 0) {

                const body = {addresses: res.emailAddresses, thread_id: this.threadId};

                this.backend.postRequest('EmailAddress/searchBeans', {}, body).subscribe(
                    (beans: any) => {
                        this.pushRelatedBeans(beans);
                    }
                );
            }

            if (!!res.thread_id) {
                this.threadId = res.thread_id;
                if (this.router.routerState.snapshot.url != '/groupware/mailitem') {
                    this.router.navigate(['/groupware/details']);
                }
            } else if (res.hasOwnProperty('thread_id') && res.thread_id == undefined) {
                this.threadId = undefined;
                this.attachments.attachments = [];
                this.relatedBeans = [];
                this.archiveattachments = [];
                this.router.navigate(['/']);
            }
        });
    }

    /**
     * push related beans from backend response to array
     * @param res
     */
    private pushRelatedBeans(res) {
        for (let item in res) {
            if (!res.hasOwnProperty(item) || this.checkRelatedBeans(res[item])) continue;
            this.relatedBeans.push(res[item]);
        }
    }
}
