import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

/**
 * Groupware service used to communicate with the SpiceCRM KREST backend.
 * Needs to be extended in order to communicate with email software (i.e. Outlook, Gmail).
 */
@Injectable()
export abstract class GroupwareService {

    public emailId: string = "";
    public _messageId: string = "";

    public archiveto: any[] = [];
    public archiveattachments: any[] = [];

    public relatedBeans: any[] = [];

    public outlookAttachments = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };

    constructor(
        protected backend: backend,
    ) {}

    /**
     * Adds a selected bean to the archive list.
     *
     * @param bean
     */
    public addBean(bean) {
        this.archiveto.push(bean);
    }

    /**
     * Removes a selected bean from the archive list.
     *
     * @param bean
     */
    public removeBean(bean) {
        let foundindex = this.archiveto.findIndex(element => bean.id == element.id);
        this.archiveto.splice(foundindex, 1);
    }

    /**
     * Checks if a bean is already on the archive list.
     *
     * @param bean
     */
    public checkBeanArchive(bean) {
        return this.archiveto.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    /**
     * Adds an attachment to the archive list.
     *
     * @param attachment
     */
    public addAttachment(attachment) {
        this.archiveattachments.push(attachment);
    }

    /**
     * Removes an attachment from the archive list.
     *
     * @param attachment
     */
    public removeAttachment(attachment) {
        let foundindex = this.archiveattachments.findIndex(element => attachment.id == element.id);
        this.archiveattachments.splice(foundindex, 1);
    }

    /**
     * Checks if an attachment is already on the archive list.
     *
     * @param attachment
     */
    public checkAttachmentArchive(attachment) {
        return this.archiveattachments.findIndex(element => attachment.id == element.id) >= 0 ? true : false;
    }

    /**
     * Returns an attachment from the list by its ID (Outlook/Exchange ID)
     *
     * @param id
     */
    public getAttachment(id) {
        return this.outlookAttachments.attachments.filter(element => id == element.id);
    }

    /**
     * Checks if a bean is already on the related beans list.
     *
     * @param bean
     */
    public checkRelatedBeans(bean) {
        return this.relatedBeans.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    /**
     * Sends a request to archive the email along with the selected beans and attachments.
     */
    public archiveEmail(): Observable<any> {
        let retSubject = new Subject();

        this.assembleEmail().subscribe(
            (email: any) => {
                let data = {
                    beans: this.archiveto,
                    email: email,
                };

                this.backend.postRequest('module/Emails/groupware/saveemailwithbeans', {}, data).subscribe(
                    (res) => {
                        if (this.archiveattachments.length > 0) {
                            let attachmentData = {
                                attachmentToken: this.outlookAttachments.attachmentToken,
                                ewsUrl: this.outlookAttachments.ewsUrl,
                                outlookAttachments: this.archiveattachments,
                                email_id: res.email_id,
                            };

                            this.backend.postRequest('module/Emails/groupware/saveaddinattachments', {}, attachmentData).subscribe(
                                success => {
                                    retSubject.next(true);
                                    retSubject.complete();
                                },
                                error => {
                                    retSubject.error('error archiving attachments');
                                    retSubject.complete();
                                }
                            );

                            this.emailId = res.email_id;
                        } else {
                            retSubject.next(true);
                            retSubject.complete();
                        }
                    },
                    error => {
                        retSubject.error('error archiving email');
                        retSubject.complete();
                    }
                );
            },
            (err) => {
                console.log('Cannot assemble email: ' + err);
            }
        );

        return retSubject.asObservable();
    }

    /**
     * Uses the message ID to check if the email has already been archived in SpiceCRM.
     * If it has, its ID (SpiceCRM DB GUID), linked beans and linked attachments are loaded.
     */
    public getEmailFromSpice(): Observable<any> {
        let retSubject = new Subject();

        let data = {
            message_id: this._messageId
        };

        this.backend.postRequest('module/Emails/groupware/getemail', {}, data).subscribe(
            (res) => {
                this.emailId = res.email_id;

                for (let beanId in res.linkedBeans) {
                    if (!this.checkBeanArchive(res.linkedBeans[beanId])) {
                        this.addBean(res.linkedBeans[beanId]);
                    }
                }

                for (let attId in res.attachments) {
                    if (attId == "") {
                        continue;
                    }

                    let currentAttachment = this.getAttachment(attId);
                    this.addAttachment(currentAttachment[0]);
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

        this.backend.postRequest('EmailAddress/searchBeans', {}, payload).subscribe(
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

    /**
     * Performs the search for beans in SpiceCRM using KREST.
     *
     * @param searchTerm
     */
    public searchSpice(searchTerm: string = ""): Observable<any> {
        let responseSubject = new Subject<any>();

        let searchParams = {
            aggregates: {},
            modules: "",
            owner: false,
            records: 10,
            searchterm: searchTerm,
            sort: {},
        };

        this.backend.postRequest('module/Emails/groupware/search', {}, searchParams).subscribe(
            (searchResults: any) => {
                responseSubject.next(searchResults);
                responseSubject.complete();
            },
            (err) => {
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    /**
     * Getter for the message ID.
     */
    get messageId() {
        return this._messageId;
    }

    /**
     * Setter for the message ID.
     *
     * @param value
     */
    set messageId(value) {
        this._messageId = value;
    }

    public abstract assembleEmail(): Observable<any>;

    public abstract getAttachments(): Observable<any>;

    public abstract getAttachmentToken(): Observable<any>;

    public abstract getAddressArray();

    public abstract getEmailAddressData();
}
