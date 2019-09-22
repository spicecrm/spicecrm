/**
 * @module Outlook
 */
import {Injectable} from "@angular/core";
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {Observable, Subject} from "rxjs";

declare var Office: any;

@Injectable()
export class OutlookGroupware extends GroupwareService {

    public iframeUrl: string = '';

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

    public getAttachments(): Observable<any> {
        let responseSubject = new Subject<any>();

        this.outlookAttachments.ewsUrl = Office.context.mailbox.ewsUrl;

        if (this.outlookAttachments.attachmentToken == '') {
            this.getAttachmentToken().subscribe(
                (res: any) => {
                    this.outlookAttachments.attachmentToken = res;

                    // set to the mailitem
                    // this.krest.attachmentToken = res;
                    // this.krest.ewsUrl = this.outlookAttachments.ewsUrl;

                    for (let i = 0; i < Office.context.mailbox.item.attachments.length; i++) {
                        this.outlookAttachments.attachments[i] = JSON.parse(
                            JSON.stringify(Office.context.mailbox.item.attachments[i]._data$p$0)
                        );
                        this.outlookAttachments.attachments[i].selected = false;
                    }

                    responseSubject.next(this.outlookAttachments);
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

    public getAttachmentToken(): Observable<any> {
        let responseSubject = new Subject<any>();

        if (this.outlookAttachments.attachmentToken == '') {
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

    public getAddressArray() {
        let toAddresses = [];
        toAddresses.push(Office.context.mailbox.item.from.emailAddress);
        for (let address of Office.context.mailbox.item.to) {
            toAddresses.push(address.emailAddress);
        }

        let ccAddresses = [];
        for (let address of Office.context.mailbox.item.cc) {
            ccAddresses.push(address.emailAddress);
        }

        let allAddresses = toAddresses.concat(ccAddresses);
        // todo remove duplicates
        return allAddresses;
    }

    public getEmailAddressData() {
        let data = {
            addresses: this.getAddressArray(),
            message_id: Office.context.mailbox.item.itemId,
        };

        return data;
    }
}
