/**
 * @module ModuleGSuite
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
    templateUrl: '../templates/gsuiteusersettings.html',
})
export class GSuiteUserSettings implements OnInit {

    /**
     * holds the folders that can be subscribed to
     */
    public subscriptionScopes: string[] = ['Calendar'];

    /**
     * a list of active subscriptions
     */
    public subscriptions: any[] = [];

    /**
     * the config for the user
     */
    public userconfig: any[] = [];

    constructor(public metadata: metadata, public model: model, public backend: backend, public configuration: configurationService) {

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
        this.backend.getRequest(`channels/groupware/gsuite/calendar/config/${this.model.id}`).subscribe(response => {
            this.userconfig = response.userconfig;
            this.subscriptions = response.subscriptions;
        });
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
    public isActive(scope: string) {
        return this.userconfig && this.userconfig.findIndex(r => r.scope == scope) >= 0;
    }

    /**
     * toggles the sync for the user
     *
     * @param sysmoduleid
     * @param e
     */
    public toggleActive(scope: string, e: MouseEvent) {
        if (e) {
            this.backend.postRequest(`channels/groupware/gsuite/calendar/notifications/${this.model.id}/${scope}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('gsuiteuserconfig', this.userconfig);
            });
        } else {
            this.backend.deleteRequest(`channels/groupware/gsuite/calendar/notifications/${this.model.id}/${scope}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('gsuiteuserconfig', this.userconfig);
            });
        }
    }

}
