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
declare var moment: any;

@Component({
    templateUrl: '../templates/exchangeusersettings.html',
})
export class ExchangeUserSettings implements OnInit {

    /**
     * holds the folders that can be subscribed to
     */
    public subscriptionOptions: any[] = ['contacts', 'calendar', 'tasks'];

    /**
     * a list of actrive subscriptions
     */
    public subscriptions: any[] = [];

    /**
     * the timeout for the subscritpion in munutes
     * withing that timeframe we always ecpet an update on the subscription from the server
     * if it is not we will indicate that the subscription is dead and needs to be renewed
     */
    public subscriptiontimeout: number;

    /**
     * holds an array wuith modules that can be synced with Exchange
     */
    public modules: any[] = [];

    /**
     * the config for the user
     */
    public userconfig: any[] = [];
    /**
     * used to call the proper service route
     * @private
     */
    private serviceName: 'msgraph' | 'spicecrmexchange' = 'spicecrmexchange';

    constructor(public metadata: metadata, public model: model, public backend: backend, public configuration: configurationService) {
        if (this.configuration.getCapabilityConfig('msgraphconfig').isActive) {
            this.serviceName = 'msgraph';
        }

        let ewsconfig = this.configuration.getCapabilityConfig('ewsconfig');
        if (ewsconfig && ewsconfig.subscriptiontimeout) {
            this.subscriptiontimeout = parseInt(ewsconfig.subscriptiontimeout, 10);
        }
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
    public getConfig() {
        this.backend.getRequest(`${this.serviceName}/config/${this.model.id}`).subscribe(response => {
            this.modules = response.modules;
            this.userconfig = response.userconfig;
            this.subscriptions = response.subscriptions;
        });
    }

    /**
     * returns if the last date + the
     * @param lastdate
     */
    public timedout(lastdate) {
        let now = new moment();
        let last = new moment(lastdate).add(this.subscriptiontimeout, 'm');
        return last.isBefore(now);
    }


    /**
     * returns the last active date if there is one
     *
     * @param folder_id
     */
    public lastActive(folder_id) {
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        return sub ? sub.last_active : '';
    }

    /**
     * returns the module for the id
     *
     * @param sysmoduleid
     */
    public getModuleNameById(sysmoduleid: string) {
        return this.metadata.getModuleById(sysmoduleid);
    }

    /**
     * returns if the user subscription is active
     *
     * @param sysmoduleid
     */
    public isActive(sysmoduleid: string) {
        return this.userconfig && this.userconfig.findIndex(r => r.sysmodule_id == sysmoduleid) >= 0;
    }

    /**
     * toggles the sync for the user
     *
     * @param sysmoduleid
     * @param e
     */
    public toggleActive(sysmoduleid: string, e: MouseEvent) {
        if (e) {
            this.backend.postRequest(`${this.serviceName}/config/${this.model.id}/${sysmoduleid}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('exchangeuserconfig', this.userconfig);
            });
        } else {
            this.backend.deleteRequest(`${this.serviceName}/config/${this.model.id}/${sysmoduleid}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('exchangeuserconfig', this.userconfig);
            });
        }
    }

}
