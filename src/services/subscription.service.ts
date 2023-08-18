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
import {model} from "./model.service";

/**
 * this service handles loading and managing the user subscriptions
 */
@Injectable({
    providedIn: 'root'
})
export class subscription {
    /**
     * holds the notifications
     */
    public _subscriptions: {[key: string]: SubscriptionI} = {};


    public auditedModules: {};

    constructor(public backend: backend,
                public broadcast: broadcast,
                public configuration: configurationService,
                public toast: toast,
                public session: session,
                public metadata: metadata,
                public language: language) {
        this.loadSubscriptions();
    }

    /**
     * a getter to get the array of subscriptions
     */
    get subscriptions(){
        return Object.keys(this._subscriptions).map(subid =>this._subscriptions[subid]);
    }

    /**
     * return true if the bean id found in subscriptions object
     * @param beanId
     */
    public hasSubscription(beanId: string) {
        return this._subscriptions?.[beanId];
    }

    /**
     * create a subscription for the given bean
     * @param beanId
     * @param beanModule
     */
    public subscribeBean(model: model): Observable<boolean> {
        let retSubject = new Subject<boolean>();

        this.backend.postRequest(`common/SpiceSubscriptions/${model.module}/${model.id}`)
            .subscribe(
                () => {
                    this._subscriptions[model.id] = {
                        bean_id: model.id,
                        bean_module: model.module,
                        user_id: this.session.authData.userId,
                        data: model.backendData
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
                delete this._subscriptions[beanId];
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
        this._subscriptions = this.configuration.getData('spicesubscriptions');
        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype !== 'loader.completed' || msg.messagedata !== 'loadUserData') return;
            this._subscriptions = this.configuration.getData('spicesubscriptions');
        });
    }
}
