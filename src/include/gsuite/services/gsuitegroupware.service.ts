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
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

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
    public subscription: Subscription = new Subscription();

    constructor(public backend: backend,
                public gSuiteBroker: GSuiteBrokerService,
                public model: model,
                public metadata: metadata,
                public router: Router) {

        super(backend, model);
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

            const data = {threadId: threadId};

            this.backend.getRequest('channels/groupware/email', data).subscribe(
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

                    this.backend.postRequest('channels/groupware/gsuite/email', {}, data).subscribe(
                        (res) => {
                            this.emailId = res.email_id;

                            if (this.archiveattachments.length > 0) {
                                let attachmentData = {
                                    attachments: this.archiveattachments,
                                    email_id: res.email_id,
                                };

                                this.backend.postRequest('channels/groupware/gsuite/attachments', {}, attachmentData).subscribe(
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
            const body = {addresses: res};
            this.relatedBeans = [];

            this.backend.postRequest('module/EmailAddress/searchbeans', {}, body).subscribe(
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
    public subscribeToGSuiteChanges() {

        this.subscription = this.gSuiteBroker.gSuiteUpdatesEmitter().subscribe(res => {

            if (!!res.attachment && !this.attachments.attachments.some(a => a.id == res.attachment.id)) {
                res.attachment.content = JSON.parse(res.attachment.content);
                this.attachments.attachments = [...this.attachments.attachments, res.attachment];
                this.archiveattachments.push(res.attachment);
            }

            if (!!res.emailAddresses && res.emailAddresses.length > 0) {

                const body = {addresses: res.emailAddresses};

                this.backend.postRequest('module/EmailAddress/searchbeans', {}, body).subscribe(
                    (beans: any) => {
                        this.pushRelatedBeans(beans);
                    }
                );
            }

            if (!!res.thread_id) {
                this.threadId = res.thread_id;
                this.emailId = '';
                if (this.router.routerState.snapshot.url != '/groupware/mailitem') {

                    const config = this.metadata.getComponentConfig('GSuitePane');
                    const mainRoute = !config.mainRoute ? '/groupware/details' : config.mainRoute;
                    this.router.navigate([mainRoute]);
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
    public pushRelatedBeans(res) {
        for (let item in res) {
            if (!res.hasOwnProperty(item) || this.checkRelatedBeans(res[item])) continue;
            this.relatedBeans.push(res[item]);
        }
    }
}
