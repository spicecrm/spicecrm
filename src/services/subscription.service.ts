/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {SubscriptionI} from "./interfaces.service";
import {language} from "./language.service";
import {toast} from "./toast.service";
import {session} from "./session.service";
import {metadata} from "./metadata.service";
import {Observable, Subject} from "rxjs";

/**
 * this service handles loading and managing the user subscriptions
 */
@Injectable()
export class subscription {
    /**
     * holds the notifications
     */
    public subscriptions: {[key: string]: SubscriptionI} = {};
    public auditedModules: {};

    constructor(private backend: backend,
                private broadcast: broadcast,
                private configuration: configurationService,
                private toast: toast,
                private session: session,
                private metadata: metadata,
                private language: language) {
        this.loadSubscriptions();
    }

    /**
     * return true if the bean id found in subscriptions object
     * @param beanId
     */
    public hasSubscription(beanId: string) {
        return this.subscriptions?.[beanId];
    }

    /**
     * create a subscription for the given bean
     * @param beanId
     * @param beanModule
     */
    public subscribeBean(beanId: string, beanModule: string): Observable<boolean> {
        let retSubject = new Subject<boolean>();

        this.backend.postRequest(`common/SpiceSubscriptions/${beanModule}/${beanId}`)
            .subscribe(
                () => {
                    this.subscriptions[beanId] = {
                        bean_id: beanId,
                        bean_module: beanModule,
                        user_id: this.session.authData.userId
                    };
                    retSubject.next(true);
                    retSubject.complete();
                },
                () => {
                    this.toast.sendToast(this.language.getLabel('MSG_FAILED_TO_SUBSCRIBE'), 'error');
                    retSubject.error('subscribe failed');
                    retSubject.complete();
                }
            );
        return retSubject.asObservable();
    }

    /**
     * delete the subscription for the given bean
     * @param beanId
     */
    public unsubscribeBean(beanId: string, beanModule: string): Observable<boolean>  {
        let retSubject = new Subject<boolean>();

        this.backend.deleteRequest(`common/SpiceSubscriptions/${beanModule}/${beanId}`).subscribe(
            () => {
                delete this.subscriptions[beanId];
                retSubject.next(true);
                retSubject.complete();
            },
            () => {
                this.toast.sendToast(this.language.getLabel('MSG_FAILED_TO_UNSUBSCRIBE'), 'error');
                retSubject.error('subscribe failed');
                retSubject.complete();
            }
        );
        return retSubject.asObservable();
    }

    /**
     * load the notifications from the configuration service
     */
    public loadSubscriptions() {
        this.subscriptions = this.configuration.getData('spicesubscriptions');
        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype !== 'loader.completed' || msg.messagedata !== 'loadUserData') return;
            this.subscriptions = this.configuration.getData('spicesubscriptions');
        });
    }
}
