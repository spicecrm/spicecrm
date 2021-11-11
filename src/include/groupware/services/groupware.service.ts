/**
 * @module ModuleGroupware
 */
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {broadcast} from "../../../services/broadcast.service";

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
        public model: model,
        public broadcast: broadcast
    ) {
    }

    /**
     * Adds a bean to the archive bean.
     * @param bean
     */
    public addBean(bean) {
        this.archiveto.push(bean);
        this.broadcast.broadcastMessage('groupware.activeto', bean);
    }

    /**
     * Remvoes a bean from the archive list.
     * @param bean
     */
    public removeBean(bean) {
        let foundindex = this.archiveto.findIndex(element => bean.id == element.id);
        this.archiveto.splice(foundindex, 1);
        this.broadcast.broadcastMessage('groupware.activeto', undefined);
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
