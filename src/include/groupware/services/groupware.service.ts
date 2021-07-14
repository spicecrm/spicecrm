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
 * @module ModuleGroupware
 */
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

/**
 * Groupware Service is used to communicate between SpiceCRM and a 3rd party platform.
 * Functions that communicate with SpiceCRM are already implemented in this class.
 * Functions that communicate with the 3rd party platform need to be implemented in a class that extends GroupwareService.
 */
@Injectable()
export abstract class GroupwareService {

    /**
     * the id of the email on SpiceCRM
     */
    public emailId: string = "";

    /**
     * the message id
     */
    public _messageId: string = "";

    /**
     * set to true when the email is being archived
     */
    public isArchiving: boolean = false;

    /**
     * A list of beans that are to be archived.
     */
    public archiveto: any[] = [];
    /**
     * A list of attachments that are to be archived.
     */
    public archiveattachments: any[] = [];
    /**
     * A list of beans related to the email.
     */
    public relatedBeans: any[] = [];
    /**
     * attachment list.
     */
    public attachments: { attachments: any[] } = {
        attachments: []
    };

    constructor(
        public backend: backend,
        public model: model
    ) {
    }

    /**
     * Adds a bean to the archive bean.
     * @param bean
     */
    public addBean(bean) {
        this.archiveto.push(bean);
    }

    /**
     * Remvoes a bean from the archive list.
     * @param bean
     */
    public removeBean(bean) {
        let foundindex = this.archiveto.findIndex(element => bean.id == element.id);
        this.archiveto.splice(foundindex, 1);
    }

    /**
     * Checks if a given bean is in the list of beans to be archived.
     * @param bean
     */
    public checkBeanArchive(bean) {
        return this.archiveto.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    /**
     * Adds an attachment to the archive list.
     * @param attachment
     */
    public addAttachment(attachment) {
        this.archiveattachments.push(attachment);
    }

    /**
     * Removes an attachment from the archive list.
     * @param attachment
     */
    public removeAttachment(attachment) {
        let foundindex = this.archiveattachments.findIndex(element => attachment.id == element.id);
        this.archiveattachments.splice(foundindex, 1);
    }

    /**
     * Checks if a given attachment is in the list of attachments that are to be archived.
     * @param attachment
     */
    public checkAttachmentArchive(attachment) {
        return this.archiveattachments.findIndex(element => element && attachment.id == element.id) >= 0 ? true : false;
    }

    /**
     * Get email attachment with the given ID.
     * @param id
     */
    public getAttachment(id) {
        return this.attachments.attachments.find(element => id == element.id);
    }

    /**
     * Checks if a given bean is already in the list of related beans.
     * @param bean
     */
    public checkRelatedBeans(bean) {
        return this.relatedBeans.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    /**
     * A call to SpiceCRM API to archive the current email.
     * It also saves the relations to the linked beans and attachments, if any were selected.
     */
    public abstract archiveEmail(): Observable<any>;

    /**
     * A call to SpiceCRM API to get an email using the message ID.
     * If an email with this ID is present, it is returned along with a list of linked beans and attachments.
     */
    public getEmailFromSpice(): Observable<any> {
        let retSubject = new Subject();

        let data = {
            messageId: this._messageId
        };

        this.backend.getRequest('channels/groupware/email', data).subscribe(
            (res) => {
                this.emailId = res.email_id;

                for (let beanId in res.linkedBeans) {
                    if (!this.checkBeanArchive(res.linkedBeans[beanId])) {
                        this.addBean(res.linkedBeans[beanId]);
                    }
                }

                for (let atttachment of res.attachments) {
                    let currentAttachment = this.getAttachment(atttachment.external_id);
                    if (currentAttachment) {
                        this.addAttachment(currentAttachment);
                    }
                }

                retSubject.next(true);
                retSubject.complete();
            },
            (err) => {
                console.log(err);
                retSubject.error(false);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    /**
     * Loads the beans from SpiceCRM that are related to any of the email addresses used in the email.
     */
    public loadLinkedBeans(): Observable<any> {
        let responseSubject = new Subject<any>();
        let payload = this.getEmailAddressData();
        this.relatedBeans = [];
        this.backend.postRequest('module/EmailAddress/searchbeans', {}, payload).subscribe(
            (res: any) => {
                for (let item in res) {
                    if (!this.checkRelatedBeans(res[item])) {
                        this.relatedBeans.push(res[item]);
                    }
                }
                responseSubject.next(this.relatedBeans);
                responseSubject.complete();
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    get messageId() {
        return this._messageId;
    }

    set messageId(value) {
        this._messageId = value;
    }

    /**
     * Convert the 3rd party email structure into json that can be sent to SpiceCRM API.
     */
    public abstract assembleEmail(): Observable<any>;

    /**
     * Retrieve a list of attachments for the current email.
     */
    public abstract getAttachments(): Observable<any>;

    /**
     * Retrieves an array of all email addresses (From, To, Cc)
     */
    public abstract getAddressArray();

    /**
     * Retrieves an of email adresses and the message ID of the current email.
     */
    public abstract getEmailAddressData();

    /**
     * Retrieves an array of all email addresses (From, To, Cc)
     */
    public abstract getCalenderItemId();

    /**
     * returns the custom properties on the object
     */
    public abstract getCustomProperties();

    /**
     * returns an access token for the authenitcation verification
     */
    public abstract getAccessToken();
}
