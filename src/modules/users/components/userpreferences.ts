/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleUsers
 */
import {Component, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {currency} from '../../../services/currency.service';
import {Subject, Subscription} from 'rxjs';
import {session} from '../../../services/session.service';
import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {metadata} from "../../../services/metadata.service";

/** @ignore */
declare var _: any;

/**
 * render the user preferences
 */
@Component({
    selector: 'user-preferences',
    templateUrl: './src/modules/users/templates/userpreferences.html',
    providers: [view]
})
export class UserPreferences implements OnDestroy {
    /**
     * holds the loaded preferences
     * @private
     */
    private preferences: any = {};
    /**
     * holds the names of the default preferences to be loaded
     * @private
     */
    private names = [
        'export_delimiter',
        'default_export_charset',
        'currency',
        'default_currency_significant_digits',
        'datef',
        'timef',
        'timezone',
        'num_grp_sep',
        'dec_sep',
        'default_locale_name_format',
        'week_day_start',
        'week_days_count',
        'calendar_day_start_hour',
        'calendar_day_end_hour',
        'reminder_time',
        'home_dashboard',
        'home_dashboardset',
        'home_assistant',
        'help_icon',
        'navigation_paradigm',
        'distance_unit_system'
    ];
    /**
     * holds the dashboard sets
     * @private
     */
    private dashboardSets: any[] = [];
    /**
     * holds the dashboard set data
     * @private
     */
    private dashboardSetData = {};
    /**
     * holds the home dashboard data
     * @private
     */
    private homeDashboardData = {};
    /**
     * holds a list of available dashboards
     * @private
     */
    private dashboards: any[] = [];
    /**
     * holds a subscription to subscribe on preferences loaded
     * @private
     */
    private loadedSubscription = new Subject<string>();
    /**
     * true if the user is admin or the current user
     * @private
     */
    private canEdit: boolean;
    /**
     * holds the current user boolean
     * @private
     */
    private isCurrentUser: boolean;

    /**
     * inidcates if the preferences are being loaded
     */
    private isLoading: boolean = true;
    /**
     * holds the subscriptions to unsubscribe
     * @private
     */
    private subscriptions: Subscription;

    constructor(
        private backend: backend,
        private view: view,
        private toast: toast,
        private currency: currency,
        private language: language,
        private preferencesService: userpreferences,
        private session: session,
        private model: model,
        private broadcast: broadcast,
        private configuration: configurationService,
        private metadata: metadata) {

        this.loadInitialValues();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the initial local list values
     * @private
     */
    private loadInitialValues() {
        this.view.isEditable = true;
        this.isCurrentUser = this.session.authData.userId == this.model.data.id;

        // Only the user himself can view/edit the preferences, or the admin if enableSettingUserPrefsByAdmin is set (true) in config.php:
        // CR1000463: use spiceacl to enable editing
        // keep BWC for old modules/ACL/ACLController.php
        const aclController = this.configuration.getSystemParamater('aclcontroller');
        if( aclController && aclController != 'spiceacl') {
            this.canEdit = this.isCurrentUser || (this.session.isAdmin && this.configuration.getSystemParamater('enableSettingUserPrefsByAdmin'));
        } else {
            // use SpiceACL access
            this.canEdit = this.metadata.checkModuleAcl('UserPreferences', 'edit');
        }

        this.loadDashboardsLists();

        this.loadPreferences();

    }

    /**
     * load user preferences
     * @private
     */
    private loadPreferences() {
        if (this.isCurrentUser || this.canEdit) {

            this.subscriptions = this.loadedSubscription.subscribe(() => {
                this.isLoading = false;
                this.preferences = _.pick(this.preferencesService.unchangedPreferences.global, this.names);

                this.setDashboardSetData(this.preferences.home_dashboardset);
                this.setHomeDashboardData(this.preferences.home_dashboard);
            });
            this.preferencesService.getPreferences(this.loadedSubscription);

        } else {
            this.backend.getRequest('user/' + this.model.data.id + '/preferences/global', {}).subscribe(prefs => {
                    this.isLoading = false;
                    this.preferences = prefs;

                    this.setDashboardSetData(prefs.home_dashboardset);
                    this.setHomeDashboardData(this.preferences.home_dashboard);
                },
                error => {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR') + ' ' + error.status, 'error', error.error.error.message);
                    if (error.status === 403) this.canEdit = true; // Error should not happen, but in case it does ...
                });
        }
    }

    /**
     * loads dashboards and dashboard sets lists
     * @private
     */
    private loadDashboardsLists() {
        this.backend.getList('Dashboards', [{sortfield: 'name', sortdirection: 'DESC'}], ['name', 'id'], {limit: -99})
            .subscribe((dashboards: any) => {
                this.dashboards = dashboards.list;
                this.setHomeDashboardData(this.preferences.home_dashboard);
            });
        this.backend.getList('DashboardSets', [{sortfield: 'name', sortdirection: 'DESC'}], ['name', 'id'], {limit: -99})
            .subscribe((dashboardSets: any) => {
                this.dashboardSets = dashboardSets.list;
                this.setDashboardSetData(this.preferences.home_dashboardset);
            });
    }

    /**
     * set the dashboard set data
     * @param value
     * @private
     */
    private setDashboardSetData(value) {
        this.preferences.home_dashboardset = value;
        this.dashboardSetData = this.dashboardSets.find(dashboardSet => dashboardSet.id == value);
    }

    /**
     * set the home dashboard data
     * @param value
     * @private
     */
    private setHomeDashboardData(value) {
        this.preferences.home_dashboard = value;
        this.homeDashboardData = this.dashboards.find(dashboard => dashboard.id == value);
    }

    /**
     * set view mode
     * @private
     */
    private cancel() {
        this.view.setViewMode();
    }

    /**
     * save preferences changes
     * @private
     */
    private save() {

        if (!this.isCurrentUser) {
            this.backend.postRequest('user/' + this.model.data.id + '/preferences/global', {}, this.preferences).subscribe(
                savedprefs => {
                    this.preferences = savedprefs;
                    this.view.setViewMode();
                },
                error => {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR') + ' ' + error.status, 'error', error.error.error.message);
                }
            );
        } else {
            this.preferencesService.setPreferences(this.preferences).subscribe(() => {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                this.preferences = _.pick(this.preferencesService.unchangedPreferences.global, this.names);

                // broadcast that the references have been saved
                this.broadcast.broadcastMessage('userpreferences.save');
            });
            this.view.setViewMode();
        }
    }
}
