/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {SubscriptionI} from "../globalcomponents/interfaces/globalcomponents.interfaces";
import {language} from "./language.service";
import {toast} from "./toast.service";
import {session} from "./session.service";
import {metadata} from "./metadata.service";

/**
 * this service handles loading and managing the user subscriptions
 */
@Injectable()
export class SubscriptionService {
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
    public subscribeBean(beanId: string, beanModule: string) {

        this.subscriptions[beanId] = {bean_id: beanId, bean_module: beanModule, user_id: this.session.authData.userId};

        this.backend.postRequest(`common/SpiceSubscriptions`, null, {beanId, beanModule})
            .subscribe(
                () =>
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_SUBSCRIBED'), 'success')
                ,
                () =>
                    this.toast.sendToast(this.language.getLabel('MSG_FAILED_TO_SUBSCRIBE'), 'error')
            );
    }

    /**
     * delete the subscription for the given bean
     * @param beanId
     */
    public unsubscribeBean(beanId: string) {

        delete this.subscriptions[beanId];

        this.backend.deleteRequest(`common/SpiceSubscriptions/${beanId}`).subscribe(
            () =>
                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_UNSUBSCRIBED'), 'success')
            ,
            () =>
                this.toast.sendToast(this.language.getLabel('MSG_FAILED_TO_UNSUBSCRIBE'), 'error')
        );
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
