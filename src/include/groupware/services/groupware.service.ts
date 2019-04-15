import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

@Injectable()
export abstract class GroupwareService {

    public emailId: string = "";
    public _messageId: string = "";

    public archiveto: any[] = [];
    public archiveattachments: any[] = [];

    public outlookAttachments = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };

    constructor(
        protected backend: backend,
    ) {}

    public addBean(bean) {
        this.archiveto.push(bean);
    }

    public removeBean(bean) {
        let foundindex = this.archiveto.findIndex(element => bean.id == element.id);
        this.archiveto.splice(foundindex, 1);
    }

    public checkBeanArchive(bean) {
        return this.archiveto.findIndex(element => bean.id == element.id) >= 0 ? true : false;
    }

    public addAttachment(attachment) {
        this.archiveattachments.push(attachment);
    }

    public removeAttachment(attachment) {
        let foundindex = this.archiveattachments.findIndex(element => attachment.id == element.id);
        this.archiveattachments.splice(foundindex, 1);
    }

    public checkAttachmentArchive(attachment) {
        return this.archiveattachments.findIndex(element => attachment.id == element.id) >= 0 ? true : false;
    }

    public getAttachment(id) {
        return this.outlookAttachments.attachments.filter(element => id == element.id);
    }

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

    get messageId() {
        return this._messageId;
    }

    set messageId(value) {
        this._messageId = value;
    }

    public abstract assembleEmail(): Observable<any>;

    public abstract getAttachments(): Observable<any>;

    public abstract getAttachmentToken(): Observable<any>;

    public abstract getAddressArray();

    public abstract getEmailAddressData();
}
