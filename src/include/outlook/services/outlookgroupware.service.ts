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
 * @module Outlook
 */
import {Injectable} from "@angular/core";
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {Observable, of, Subject} from "rxjs";
import {OutlookAttachmentI} from "../interfaces/outlook.interfaces";

declare var Office: any;
declare var _: any;

/**
 * Extension of the groupware service used to communicate with Outlook.
 */
@Injectable()
export class OutlookGroupware extends GroupwareService {

    /**
     * attachment list.
     */
    public attachments: OutlookAttachmentI = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };
    public iframeUrl: string = '';

    /**
     * Loads the email data from Outlook and assembles it into a GroupwareEmail object.
     */
    public assembleEmail(): Observable<any> {
        let responseSubject = new Subject<any>();

        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, async => {

            let toAddresses = [];
            for (let address of Office.context.mailbox.item.to) {
                toAddresses.push(address.emailAddress);
            }
            let toAddrs = toAddresses.join(',');

            let ccAddresses = [];
            for (let address of Office.context.mailbox.item.cc) {
                ccAddresses.push(address.emailAddress);
            }
            let ccAddrs = ccAddresses.join(',');

            let emailBody;
            emailBody = async.value;

            let email: GroupwareEmail;

            email = {
                body: emailBody,
                cc: ccAddrs,
                date: Office.context.mailbox.item.dateTimeCreated.toUTCString(),
                from: Office.context.mailbox.item.from.emailAddress,
                message_id: Office.context.mailbox.item.itemId,
                replyto: Office.context.mailbox.item.from.emailAddress,
                subject: Office.context.mailbox.item.subject,
                to: toAddrs,
            };

            responseSubject.next(email);
            responseSubject.complete();
        });

        return responseSubject.asObservable();
    }


    /**
     * A call to SpiceCRM API to archive the current email.
     * It also saves the relations to the linked beans and attachments, if any were selected.
     */
    public archiveEmail(): Observable<any> {
        let retSubject = new Subject();

        this.isArchiving = true;

        this.assembleEmail().subscribe(
            (email: any) => {
                let data = {
                    beans: this.archiveto,
                    email: email,
                    bean: this.modelutilities.spiceModel2backend('Emails', this.model.data)
                };

                this.backend.postRequest('module/Emails/groupware/saveOutlookEmailWithBeans', {}, data).subscribe(
                    (res) => {
                        if (this.archiveattachments.length > 0) {
                            let attachmentData = {
                                attachmentToken: this.attachments.attachmentToken,
                                ewsUrl: this.attachments.ewsUrl,
                                outlookAttachments: this.archiveattachments,
                                email_id: res.email_id,
                            };

                            this.backend.postRequest('module/Emails/groupware/saveOutlookAttachments', {}, attachmentData).subscribe(
                                success => {
                                    this.isArchiving = false;
                                    retSubject.next(true);
                                    retSubject.complete();
                                },
                                error => {
                                    this.isArchiving = false;
                                    retSubject.error('error archiving attachments');
                                    retSubject.complete();
                                }
                            );

                            this.emailId = res.email_id;
                        } else {
                            this.isArchiving = false;
                            retSubject.next(true);
                            retSubject.complete();
                        }
                    },
                    error => {
                        this.isArchiving = false;
                        retSubject.error('error archiving email');
                        retSubject.complete();
                    }
                );
            },
            (err) => {
                // console.log('Cannot assemble email: ' + err);
                retSubject.error('error assembling email');
                retSubject.complete();
                this.isArchiving = false;
            }
        );

        return retSubject.asObservable();
    }

    /**
     * Load the email attachment data from Outlook including the information about each attachment,
     * as well as the EWS server URL and a temporary attachment token used to download the attachments in the backend.
     */
    public getAttachments(): Observable<any> {
        let responseSubject = new Subject<any>();

        this.attachments.ewsUrl = Office.context.mailbox.ewsUrl;

        if (this.attachments.attachmentToken == '') {
            this.getAttachmentToken().subscribe(
                (res: any) => {
                    this.attachments.attachmentToken = res;

                    for (let i = 0; i < Office.context.mailbox.item.attachments.length; i++) {
                        this.attachments.attachments[i] = _.clone(Office.context.mailbox.item.attachments[i]);
                        this.attachments.attachments[i].selected = false;
                    }

                    responseSubject.next(this.attachments);
                    responseSubject.complete();
                },
                (err) => {
                    responseSubject.error(err);
                }
            );
        } else {
            responseSubject.error('No attachment token found.');
        }

        return responseSubject.asObservable();
    }

    /**
     * Load the attachment token.
     */
    public getAttachmentToken(): Observable<any> {
        let responseSubject = new Subject<any>();

        if (this.attachments.attachmentToken == '') {
            Office.context.mailbox.getCallbackTokenAsync(res => {
                if (res.status === Office.AsyncResultStatus.Succeeded) {
                    responseSubject.next(res.value);
                    responseSubject.complete();
                } else {
                    responseSubject.error("Could not get callback token: " + res.error.message);
                }
            });
        }

        return responseSubject.asObservable();
    }

    /**
     * Returns an array of email adresses used in the selected email.
     */
    public getAddressArray(includeown: boolean = false) {
        let toAddresses = [];
        toAddresses.push(Office.context.mailbox.item.from.emailAddress);
        for (let address of Office.context.mailbox.item.to) {
            if (includeown || address.emailAddress != Office.context.mailbox.userProfile.emailAddress) {
                toAddresses.push(address.emailAddress);
            }
        }

        let ccAddresses = [];
        for (let address of Office.context.mailbox.item.cc) {
            if (includeown || address.emailAddress != Office.context.mailbox.userProfile.emailAddress) {
                ccAddresses.push(address.emailAddress);
            }
        }

        let allAddresses = toAddresses.concat(ccAddresses);
        // todo remove duplicates
        return allAddresses;
    }

    /**
     * Returns the email adresses array and the message ID (Outlook ID) of the selected email.
     */
    public getEmailAddressData() {
        let data = {
            addresses: this.getAddressArray(),
            message_id: Office.context.mailbox.item.itemId,
        };

        return data;
    }

    /**
     * get the calendar item id
     */
    public getCalenderItemId(): Observable<string> {
        if (Office.context.mailbox.item.itemId) {
            return of(Office.context.mailbox.item.itemId);
        } else {
            let retSubject = new Subject<string>();
            Office.context.mailbox.item.getItemIdAsync(id => {
                retSubject.next(id.value);
                retSubject.complete();
            });
            return retSubject.asObservable();
        }
    }

    public getCustomProperties(): Observable<any> {
        let retSubject = new Subject<any>();
        Office.context.mailbox.item.loadCustomPropertiesAsync(cProps => {
            retSubject.next(cProps.value);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    public getAccessToken(): Observable<any> {
        let retSubject = new Subject<any>();
        Office.context.auth.getAccessTokenAsync({forMSGraphAccess: true}, token => {
            if (token.status == 'succeeded') {
                this.backend.getRequest('spicecrmexchange/validate/' + token.value + '?XDEBUG_SESSION_START=PHPSTORM').subscribe(res => {
                    console.log(res);
                });
            }
            retSubject.next(token);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }


}
