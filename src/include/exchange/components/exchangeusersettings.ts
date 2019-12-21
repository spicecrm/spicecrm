/**
 * @module SpiceImporterModule
 */
import {Component, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {navigation} from '../../../services/navigation.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    templateUrl: './src/include/exchange/templates/exchangeusersettings.html',
})
export class ExchangeUserSettings implements OnInit {

    /**
     * holds the folders that can be subscribed to
     */
    private subscriptionOptions: any[] = ['contacts', 'calendar', 'tasks'];

    /**
     * a list of actrive subscriptions
     */
    private subscriptions: any[] = [];

    constructor(private model: model, private backend: backend) {

    }

    /**
     * load the active subscriptions
     */
    public ngOnInit(): void {
        this.loadSubscriptions();
    }

    /**
     * subscribe to a folder
     */
    private subscribe() {
        this.backend.postRequest(`spicecrmexchange/subscriptions/${this.model.id}/subscribe`).subscribe(response => {
            console.log(response);
        });
    }

    /**
     * subscribe to a folder
     */
    private reload() {
        this.loadSubscriptions();
    }

    /**
     * loads the subscriptions
     */
    private loadSubscriptions() {
        this.subscriptions = [];
        this.backend.getRequest(`spicecrmexchange/subscriptions/${this.model.id}`).subscribe(subscriptions => {
            this.subscriptions = subscriptions;
        });
    }


    /**
     * returns the last active date if there is one
     *
     * @param folder_id
     */
    private lastActive(folder_id) {
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        return sub ? sub.last_active : '';
    }

    private getSubscriptionIcon(folder_id){
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        return sub && sub.subscriptionid ? 'check' : 'add';
    }

    /**
     * returns the last active date if there is one
     *
     * @param folder_id
     */
    private toggle(folder_id) {
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        if (sub && sub.subscriptionid) {
            this.backend.deleteRequest(`spicecrmexchange/subscriptions/${this.model.id}/${folder_id}`).subscribe(response => {
                this.reload();
            });
        } else {
            this.backend.postRequest(`spicecrmexchange/subscriptions/${this.model.id}/${folder_id}`).subscribe(response => {
                this.reload();
            });
        }
    }
}
