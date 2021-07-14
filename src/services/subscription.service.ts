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
