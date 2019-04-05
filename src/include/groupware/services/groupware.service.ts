import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

@Injectable()
export abstract class GroupwareService {

    protected emailId: string = "";
    public messageId: string = "";

    public archiveto: any[] = [];
    public archiveattachments: any[] = [];

    public outlookAttachments = {
        attachmentToken: '',
        ewsUrl: '',
        attachments: [],
    };

    constructor(
        protected backend: backend,
        protected http: HttpClient,
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

    public archiveEmail(): Observable<any> {
        let retSubject = new Subject();

        this.assembleEmail().subscribe(
            (email: any) => {
                let data = {
                    beans: this.archiveto,
                    email: email,
                };

                this.backend.postRequest('emails/saveemailwithbeans', {}, data).subscribe(
                    success => {
                        if (this.archiveattachments.length > 0) {
                            let attachmentData = {
                                attachmentToken: this.outlookAttachments.attachmentToken,
                                ewsUrl: this.outlookAttachments.ewsUrl,
                                outlookAttachments: this.archiveattachments,
                                email_id: this.emailId,
                            };

                            this.backend.postRequest('emails/saveaddinattachments', {}, attachmentData).subscribe(
                                success => {
                                    retSubject.next(true);
                                    retSubject.complete();
                                },
                                error => {
                                    retSubject.error('error archiving attachments');
                                    retSubject.complete();
                                }
                            );
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


    protected abstract getEmailId();

    public abstract assembleEmail(): Observable<any>;

    public abstract getAttachments(): Observable<any>;

    public abstract getAttachmentToken(): Observable<any>;

    public abstract getAddressArray();

    public abstract getEmailAddressData();
}
