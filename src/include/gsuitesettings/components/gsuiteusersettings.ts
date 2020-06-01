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
    templateUrl: './src/include/gsuitesettings/templates/gsuiteusersettings.html',
})
export class GSuiteUserSettings implements OnInit {

    /**
     * holds the folders that can be subscribed to
     */
    private subscriptionScopes: string[] = ['Calendar'];

    /**
     * a list of active subscriptions
     */
    private subscriptions: any[] = [];

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
        this.backend.getRequest(`/google/calendar/config/${this.model.id}`).subscribe(response => {
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
    private isActive(scope: string) {
        return this.userconfig && this.userconfig.findIndex(r => r.scope == scope) >= 0;
    }

    /**
     * toggles the sync for the user
     *
     * @param sysmoduleid
     * @param e
     */
    private toggleActive(scope: string, e: MouseEvent) {
        if (e) {
            this.backend.postRequest(`/google/calendar/notifications/${this.model.id}/${scope}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('gsuiteuserconfig', this.userconfig);
            });
        } else {
            this.backend.deleteRequest(`/google/calendar/notifications/${this.model.id}/${scope}`).subscribe(res => {
                this.userconfig = res.userconfig;
                this.subscriptions = res.subscriptions;

                // set the user config
                this.configuration.setData('gsuiteuserconfig', this.userconfig);
            });
        }
    }

}
