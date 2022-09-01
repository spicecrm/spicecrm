/**
 * @module ModuleExchange
 */
import {Component, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {firstValueFrom} from "rxjs";
import {session} from "../../../services/session.service";

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
     * if the user was logged in with microsoft oauth2
     */
    public microsoftLoggedIn: boolean = false;

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
    public userconfig: {[key: symbol]: any} = {};
    /**
     * used to call the proper service route
     * @private
     */
    private serviceName: 'msgraph' | 'spicecrmexchange' = 'spicecrmexchange';
    /**
     * loading backend data
     */
    public isLoading: string;

    constructor(public metadata: metadata,
                public model: model,
                public toast: toast,
                public session: session,
                public modal: modal,
                public backend: backend,
                public configuration: configurationService) {
        if (this.configuration.getCapabilityConfig('msgraphconfig').isActive) {
            this.serviceName = 'msgraph';
        }
        const configName = this.serviceName == 'msgraph' ? 'msgraphconfig' : 'ewsconfig';
        let ewsconfig = this.configuration.getCapabilityConfig(configName);
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
            this.modules.forEach(m => m.moduleName = this.metadata.getModuleById(m.sysmodule_id))
            this.userconfig = response.userconfig;
            this.subscriptions = response.subscriptions;
            this.microsoftLoggedIn = response.microsoftLoggedIn;
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
     * toggles the sync for the user
     *
     * @param moduleConfig
     * @param value
     * @param checkbox
     */
    public async toggleActive(moduleConfig: any, value, checkbox: any) {

        const sysmoduleid = moduleConfig.sysmodule_id;

        if (value) {

            if (moduleConfig.moduleName == 'Tasks') {
                const lists: { value: string, display: string}[] = await firstValueFrom(this.backend.getRequest(`${this.serviceName}/config/${this.model.id}/todoLists`)).catch(() => undefined);
                if (!lists) {
                    this.toast.sendToast('todo lists could not be retrieved', 'error');
                    checkbox.writeValue(false);
                    return;
                }

                const listId: string = await firstValueFrom(this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_GRAPH_LIST', 'shade', undefined, lists));
                if (!listId) {
                    checkbox.writeValue(false);
                    return;
                }
                moduleConfig.sync_config = {toDoList: lists.find(l => l.value == listId)};
            }

            this.backend.postRequest(`${this.serviceName}/config/${this.model.id}/${sysmoduleid}`, null, {sync_config: moduleConfig.sync_config}).subscribe({
                next: res => {
                    this.userconfig = res.userconfig;
                    this.subscriptions = res.subscriptions;

                    // set the user config
                    this.configuration.setData('exchangeuserconfig', this.userconfig);
                    this.toast.sendToast('LBL_ACTIVATED', 'success');

                },
                error: err => {
                    this.toast.sendToast(err.error.error.message, 'error');
                    checkbox.writeValue(false);
                }
            });
        } else {
            this.backend.deleteRequest(`${this.serviceName}/config/${this.model.id}/${sysmoduleid}`).subscribe({
                next: res => {
                    this.userconfig = res.userconfig;
                    this.subscriptions = res.subscriptions;

                    // set the user config
                    this.configuration.setData('exchangeuserconfig', this.userconfig);
                    this.toast.sendToast('LBL_DEACTIVATED', 'success');
                },
                error: err => {
                    this.toast.sendToast(err.error.error.message, 'error');
                    checkbox.writeValue(true);
                }
            });
        }
    }

    /**
     * refresh user subscription
     * @param subscription
     */
    public refreshSubscription(subscription: any) {
        this.isLoading = subscription.subscriptionid;
        this.backend.postRequest(`${this.serviceName}/config/${this.model.id}/${subscription.folder_id}/refreshSubscription/${subscription.subscriptionid}`).subscribe({
            next: res => {
                this.subscriptions = res.subscriptions;
                this.isLoading = undefined;
                // set the user config
                this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');

            },
            error: err => {
                this.toast.sendToast(err.error.error.message, 'error');
            }
        });
    }
}
