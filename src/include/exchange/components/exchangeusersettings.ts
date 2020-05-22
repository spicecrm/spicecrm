/**
 * @module ModuleExchange
 */
import {Component, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';

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

    /**
     * holds an array wuith modules that can be synced with Exchange
     */
    private modules: any[] = [];

    /**
     * the config for the user
     */
    private userconfig: any[] = [];

    constructor(private metadata: metadata, private model: model, private backend: backend, private configuration: configurationService) {

    }

    /**
     * load the active subscriptions
     */
    public ngOnInit(): void {
        this.getConfig();
    }

    /**
     * loads the config from the backend
     */
    private getConfig() {
        this.backend.getRequest(`spicecrmexchange/config/${this.model.id}`).subscribe(response => {
            this.modules = response.modules;
            this.userconfig = response.userconfig;
            this.subscriptions = response.subscriptions;
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

    /**
     * returns the module for the id
     *
     * @param sysmoduleid
     */
    private getModuleNameById(sysmoduleid: string) {
        return this.metadata.getModuleById(sysmoduleid);
    }

    /**
     * returns if the user subscription is active
     *
     * @param sysmoduleid
     */
    private isActive(sysmoduleid: string) {
        return this.userconfig && this.userconfig.findIndex(r => r.sysmodule_id == sysmoduleid) >= 0;
    }

    /**
     * toggles the sync for the user
     *
     * @param sysmoduleid
     * @param e
     */
    private toggleActive(sysmoduleid: string, e: MouseEvent) {
        if (e) {
            this.backend.postRequest('spicecrmexchange/config/' + this.model.id + '/' + sysmoduleid).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('exchangeuserconfig', this.userconfig);
            });
        } else {
            this.backend.deleteRequest('spicecrmexchange/config/' + this.model.id + '/' + sysmoduleid).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('exchangeuserconfig', this.userconfig);
            });
        }
    }

}
