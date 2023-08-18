/**
 * @module ModuleExchange
 */
import {Component, ComponentRef, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {firstValueFrom, of} from "rxjs";
import {session} from "../../../services/session.service";
import {MSGraphMappingModal} from "./msgraphmappingmodal";
import {userpreferences} from "../../../services/userpreferences.service";

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
     * loading backend data
     */
    public isLoading: string;

    constructor(public metadata: metadata,
                public model: model,
                public toast: toast,
                public session: session,
                public modal: modal,
                public backend: backend,
                public userPreferences: userpreferences,
                public configuration: configurationService) {

        this.setSubscriptionTime();
    }

    /**
     * cached active api value
     * @private
     */
    private _activeAPI: 'msgraph' | 'spicecrmexchange' = 'msgraph';
    /**
     * set active api
     * @param val
     */
    set activeAPI(val: 'msgraph' | 'spicecrmexchange') {

        const loadingModal = this.modal.await('LBL_LOADING');

        this._activeAPI = val;

        if (this.model.id === this.session.authData.userId) {
            this.userPreferences.setPreference('microsoftActiveService', val).subscribe(() => {
                loadingModal.next(true);
                loadingModal.complete();
                this.getConfig();
            });
        } else {
            this.backend.postRequest(`module/Users/${this.model.id}/preferences/global`, {}, {microsoftActiveService: val})
                .subscribe(() => {
                    loadingModal.next(true);
                    loadingModal.complete();
                    this.getConfig();
                });

        }

    }

    /**
     * @return active api
     */
    get activeAPI(): 'msgraph' | 'spicecrmexchange' {
        return this._activeAPI;
    }

    /**
     * load active api preference
     * @private
     */
    private loadActiveAPIPreference() {

        if (this.model.id !== this.session.authData.userId) {

            const loadingModal = this.modal.await('LBL_LOADING');
            const params = {names: ['microsoftActiveService']};

            return this.backend.getRequest(`module/Users/${this.model.id}/preferences/global`, params).subscribe(prefs => {
                loadingModal.next(true);
                loadingModal.complete();
                if (!!prefs.microsoftActiveService) {
                    this._activeAPI = prefs.microsoftActiveService;
                }
                this.getConfig();
            });

        } else if (!!this.userPreferences.preferences.global.microsoftActiveService) {
            this._activeAPI = this.userPreferences.preferences.global.microsoftActiveService;
            this.getConfig();
        }
        else {
            this.getConfig();
        }
    }

    /**
     * load the active subscriptions
     */
    public ngOnInit(): void {
        this.loadActiveAPIPreference();
    }

    private setSubscriptionTime() {
        const configName = this.activeAPI == 'msgraph' ? 'msgraphconfig' : 'ewsconfig';
        let ewsconfig = this.configuration.getCapabilityConfig(configName);
        if (ewsconfig && ewsconfig.subscriptiontimeout) {
            this.subscriptiontimeout = parseInt(ewsconfig.subscriptiontimeout, 10);
        }
    }

    /**
     * loads the config from the backend
     */
    public getConfig() {

        const loadingModal = this.modal.await('LBL_LOADING');

        this.backend.getRequest(`${this.activeAPI}/config/${this.model.id}`).subscribe(response => {
            loadingModal.next(true);
            loadingModal.complete();

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
     * @param moduleData
     * @param value
     * @param checkbox
     */
    public async toggleActive(moduleData: any, value, checkbox: any) {

        const sysmoduleid = moduleData.sysmodule_id;
        let syncConfig = undefined;

        if (value) {

            if (moduleData.moduleName == 'Tasks') {
                const lists: { value: string, display: string}[] = await firstValueFrom(this.backend.getRequest(`${this.activeAPI}/config/${this.model.id}/todoLists`)).catch(() => undefined);
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
                syncConfig = {toDoList: lists.find(l => l.value == listId)};
            }

            this.isLoading = moduleData.moduleName;

            this.backend.postRequest(`${this.activeAPI}/config/${this.model.id}/${sysmoduleid}`, null, {syncConfig}).subscribe({
                next: res => {
                    this.isLoading = undefined;
                    this.userconfig = res.userconfig;
                    this.subscriptions = res.subscriptions;

                    // set the user config
                    this.configuration.setData('microsoftserviceuserconfig', this.userconfig);
                    this.toast.sendToast('LBL_ACTIVATED', 'success');

                },
                error: err => {
                    this.isLoading = undefined;
                    this.toast.sendToast(err.error.error.message, 'error');
                    checkbox.writeValue(false);
                }
            });
        } else {
            this.isLoading = moduleData.moduleName;

            this.backend.deleteRequest(`${this.activeAPI}/config/${this.model.id}/${sysmoduleid}`).subscribe({
                next: res => {
                    this.isLoading = undefined;
                    this.userconfig = res.userconfig;
                    this.subscriptions = res.subscriptions;

                    // set the user config
                    this.configuration.setData('microsoftserviceuserconfig', this.userconfig);
                    this.toast.sendToast('LBL_DEACTIVATED', 'success');
                },
                error: err => {
                    this.isLoading = undefined;
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
        this.backend.postRequest(`${this.activeAPI}/config/${this.model.id}/${subscription.folder_id}/refreshSubscription/${subscription.subscriptionid}`).subscribe({
            next: res => {
                this.isLoading = undefined;
                this.subscriptions = res.subscriptions;
                // set the user config
                this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');

            },
            error: err => {
                this.isLoading = undefined;
                this.toast.sendToast(err.error.error.message, 'error');
            }
        });
    }

    public displayMapping(module) {
        this.modal.openModal('MSGraphMappingModal').subscribe((modalRef: ComponentRef<MSGraphMappingModal>) => {
            modalRef.instance.mapping = module.mapping;
        });
    }
}
