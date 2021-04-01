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
     * the timeout for the subscritpion in munutes
     * withing that timeframe we always ecpet an update on the subscription from the server
     * if it is not we will indicate that the subscription is dead and needs to be renewed
     */
    private subscriptiontimeout: number;

    /**
     * holds an array wuith modules that can be synced with Exchange
     */
    private modules: any[] = [];

    /**
     * the config for the user
     */
    private userconfig: any[] = [];

    constructor(private metadata: metadata, private model: model, private backend: backend, private configuration: configurationService) {
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
    private getConfig() {
        this.backend.getRequest(`spicecrmexchange/config/${this.model.id}`).subscribe(response => {
            this.modules = response.modules;
            this.userconfig = response.userconfig;
            this.subscriptions = response.subscriptions;
        });
    }

    /**
     * returns if the last date + the
     * @param lastdate
     */
    private timedout(lastdate) {
        let now = new moment();
        let last = new moment(lastdate).add(this.subscriptiontimeout, 'm');
        return last.isBefore(now);
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
