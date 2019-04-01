import {Injectable} from "@angular/core";
import {GroupwareService} from "../../groupware/services/groupware.service";
import {Observable, Subject} from "rxjs";
import {CanActivate, Router} from "@angular/router";
import {session} from "../../../services/session.service";
import {loader} from "../../../services/loader.service";
import {loginService} from "../../../services/login.service";

declare var Office: any;

@Injectable()
export class OutlookGroupware extends GroupwareService {

    public iframeUrl: string = '';

    protected getEmailId() {
        let messageId = Office.context.mailbox.item.itemId;
        let data = {
            message_id: messageId,
        };

        this.backend.postRequest('emails/getemailid', {}, data).subscribe(
            (res: any) => {
                if (res.email_id != null) {
                    this.emailId = res.email_id;
                    this.archiveto = res.linked_beans;
                }
                console.log(res);
            },
            (err) => {
                console.log(err);
            }
        );
    }

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

        this.configuration.serviceRequest.ewsUrl = Office.context.mailbox.ewsUrl;

        if (this.configuration.serviceRequest.attachmentToken == '') {
            this.getAttachmentToken().subscribe(
                (res: any) => {
                    this.configuration.serviceRequest.attachmentToken = res;

                    // set to the mailitem
                    // this.krest.attachmentToken = res;
                    // this.krest.ewsUrl = this.configuration.serviceRequest.ewsUrl;

                    for (let i = 0; i < Office.context.mailbox.item.attachments.length; i++) {
                        this.configuration.serviceRequest.attachments[i] = JSON.parse(
                            JSON.stringify(Office.context.mailbox.item.attachments[i]._data$p$0)
                        );
                        this.configuration.serviceRequest.attachments[i].selected = false;
                    }

                    responseSubject.next(this.configuration.serviceRequest);
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

        if (this.configuration.serviceRequest.attachmentToken == '') {
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
